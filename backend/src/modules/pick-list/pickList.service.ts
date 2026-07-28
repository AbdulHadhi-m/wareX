import mongoose from 'mongoose';
import { PickListRepository } from './pickList.repository';
import {
  CreatePickListDTO,
  AssignPickListDTO,
  PickListResponse,
  PickListSearchParams,
  IPickList,
} from './pickList.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { ValidationError } from '../../shared/errors/validation-error';
import { AuthorizationError } from '../../shared/errors/authorization-error';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';
import { UserModel } from '../auth/auth.model';
import { DeviceModel } from '../device/device.model';

export class PickListService {
  constructor(
    private readonly pickListRepository: PickListRepository,
  ) {}

  async create(dto: CreatePickListDTO, userId: string): Promise<PickListResponse> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (dto.workerId) {
        const worker = await UserModel.findById(dto.workerId)
          .session(session)
          .lean();

        if (!worker || worker.role !== 'Worker') {
          throw new NotFoundError('Worker not found');
        }
      }

      const uniqueDeviceIds = [...new Set(dto.deviceIds)];

      const devices = await DeviceModel.find({
        _id: { $in: uniqueDeviceIds },
        isDeleted: { $ne: true },
      } as any)
        .session(session)
        .lean();

      if (devices.length !== uniqueDeviceIds.length) {
        throw new NotFoundError('One or more devices not found');
      }

      for (const device of devices) {
        if (device.status !== 'Available') {
          throw new ConflictError(
            `Device "${device.deviceName}" (${device.serialNumber}) is not available. Current status: ${device.status}`,
          );
        }
      }

      for (const deviceId of uniqueDeviceIds) {
        const active = await this.pickListRepository.findActiveByDeviceId(deviceId, session);

        if (active) {
          throw new ConflictError(
            `Device is already part of active pick list ${active.pickListNumber}`,
          );
        }
      }

      const pickListNumber = await this.generatePickListNumber(session);

      const status = dto.workerId ? 'Assigned' : 'Draft';

      const pickList = await this.pickListRepository.create(
        {
          pickListNumber,
          workerId: dto.workerId ?? null,
          deviceIds: uniqueDeviceIds,
          status,
          priority: dto.priority,
          notes: dto.notes ?? null,
          createdBy: userId,
          updatedBy: userId,
        },
        session,
      );

      await DeviceModel.updateMany(
        { _id: { $in: uniqueDeviceIds } } as any,
        { $set: { status: 'Reserved', updatedBy: userId } },
        { session },
      );

      await session.commitTransaction();

      return this.toPickListResponse(pickList);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async search(
    params: PickListSearchParams,
    userRole?: string,
    userId?: string,
  ): Promise<{ data: PickListResponse[]; meta: PaginationMeta }> {
    const filter = this.pickListRepository.buildFilter(params);

    if (userRole === 'Worker' && userId) {
      filter.workerId = userId;
    }

    const pagination = parsePagination({ page: params.page, limit: params.limit });

    const sort: Record<string, 1 | -1> = {
      [params.sortBy]: params.sortOrder === 'asc' ? 1 : -1,
    };

    const [pickLists, total] = await Promise.all([
      this.pickListRepository.search(filter, pagination.skip, pagination.limit, sort),
      this.pickListRepository.count(filter),
    ]);

    return {
      data: pickLists.map((p) => this.toPickListResponse(p)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<PickListResponse> {
    const pickList = await this.pickListRepository.findById(id);

    if (!pickList) {
      throw new NotFoundError('Pick list not found');
    }

    return this.toPickListResponse(pickList);
  }

  async getByWorker(
    workerId: string,
    pageInput: { page?: number; limit?: number },
  ): Promise<{ data: PickListResponse[]; meta: PaginationMeta }> {
    const worker = await UserModel.findById(workerId).lean();

    if (!worker || worker.role !== 'Worker') {
      throw new NotFoundError('Worker not found');
    }

    const pagination = parsePagination(pageInput);

    const filter: Record<string, unknown> = { workerId };

    const sort: Record<string, 1 | -1> = { createdAt: -1 };

    const [pickLists, total] = await Promise.all([
      this.pickListRepository.search(filter, pagination.skip, pagination.limit, sort),
      this.pickListRepository.count(filter),
    ]);

    return {
      data: pickLists.map((p) => this.toPickListResponse(p)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async assign(id: string, dto: AssignPickListDTO, userId: string): Promise<PickListResponse> {
    const pickList = await this.pickListRepository.findById(id);

    if (!pickList) {
      throw new NotFoundError('Pick list not found');
    }

    if (pickList.status === 'Completed' || pickList.status === 'Cancelled') {
      throw new ValidationError('Cannot assign a completed or cancelled pick list');
    }

    const worker = await UserModel.findById(dto.workerId).lean();

    if (!worker || worker.role !== 'Worker') {
      throw new NotFoundError('Worker not found');
    }

    const nextStatus = pickList.status === 'Draft' ? 'Assigned' : pickList.status;

    const updated = await this.pickListRepository.update(id, {
      workerId: dto.workerId,
      status: nextStatus,
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Pick list not found after update');
    }

    return this.toPickListResponse(updated);
  }

  async start(id: string, userId: string): Promise<PickListResponse> {
    const pickList = await this.pickListRepository.findById(id);

    if (!pickList) {
      throw new NotFoundError('Pick list not found');
    }

    if (pickList.status !== 'Assigned') {
      throw new ValidationError('Only assigned pick lists can be started');
    }

    if (pickList.workerId !== userId) {
      throw new AuthorizationError('You are not the assigned worker for this pick list');
    }

    const updated = await this.pickListRepository.update(id, {
      status: 'In Progress',
      startedAt: new Date(),
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Pick list not found after update');
    }

    return this.toPickListResponse(updated);
  }

  async complete(id: string, userId: string): Promise<PickListResponse> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const pickList = await this.pickListRepository.findById(id);

      if (!pickList) {
        throw new NotFoundError('Pick list not found');
      }

      if (pickList.status !== 'In Progress') {
        throw new ValidationError('Only in-progress pick lists can be completed');
      }

      if (pickList.workerId !== userId) {
        throw new AuthorizationError('You are not the assigned worker for this pick list');
      }

      const updated = await this.pickListRepository.update(
        id,
        {
          status: 'Completed',
          completedAt: new Date(),
          updatedBy: userId,
        },
        session,
      );

      if (!updated) {
        throw new NotFoundError('Pick list not found after update');
      }

      await DeviceModel.updateMany(
        { _id: { $in: pickList.deviceIds } } as any,
        { $set: { status: 'Picked', updatedBy: userId } },
        { session },
      );

      await session.commitTransaction();

      return this.toPickListResponse(updated);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async cancel(id: string, userId: string): Promise<PickListResponse> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const pickList = await this.pickListRepository.findById(id);

      if (!pickList) {
        throw new NotFoundError('Pick list not found');
      }

      if (pickList.status === 'Completed' || pickList.status === 'Cancelled') {
        throw new ValidationError('Cannot cancel a completed or already cancelled pick list');
      }

      const updated = await this.pickListRepository.update(
        id,
        {
          status: 'Cancelled',
          updatedBy: userId,
        },
        session,
      );

      if (!updated) {
        throw new NotFoundError('Pick list not found after update');
      }

      await DeviceModel.updateMany(
        { _id: { $in: pickList.deviceIds } } as any,
        { $set: { status: 'Available', updatedBy: userId } },
        { session },
      );

      await session.commitTransaction();

      return this.toPickListResponse(updated);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  private async generatePickListNumber(session?: mongoose.ClientSession): Promise<string> {
    const last = await this.pickListRepository.findLastPickList(session);

    let nextNum = 1;

    if (last && last.pickListNumber) {
      const match = last.pickListNumber.match(/PL-(\d+)/);

      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    return `PL-${String(nextNum).padStart(5, '0')}`;
  }

  private toPickListResponse(pickList: IPickList): PickListResponse {
    return {
      id: pickList._id.toString(),
      pickListNumber: pickList.pickListNumber,
      workerId: pickList.workerId || undefined,
      deviceIds: pickList.deviceIds,
      status: pickList.status,
      priority: pickList.priority,
      notes: pickList.notes,
      createdBy: pickList.createdBy,
      updatedBy: pickList.updatedBy,
      startedAt: pickList.startedAt
        ? new Date(pickList.startedAt).toISOString()
        : undefined,
      completedAt: pickList.completedAt
        ? new Date(pickList.completedAt).toISOString()
        : undefined,
      createdAt: new Date(pickList.createdAt).toISOString(),
      updatedAt: new Date(pickList.updatedAt).toISOString(),
    };
  }
}
