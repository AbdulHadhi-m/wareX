import mongoose from 'mongoose';
import { OrderRepository } from './order.repository';
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderResponse,
  OrderSearchParams,
  IOrder,
} from './order.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { ValidationError } from '../../shared/errors/validation-error';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';
import { DeviceModel } from '../device/device.model';
import { PickListModel } from '../pick-list/pickList.model';
import { OrderModel } from './order.model';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  async create(dto: CreateOrderDTO, userId: string): Promise<OrderResponse> {
    const uniqueDeviceIds = [...new Set(dto.deviceIds)];

    const devices = await DeviceModel.find({
      _id: { $in: uniqueDeviceIds },
      isDeleted: { $ne: true },
    } as any).lean();

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
      const active = await this.orderRepository.findActiveByDeviceId(deviceId);

      if (active) {
        throw new ConflictError(
          `Device is already part of active order ${active.orderNumber}`,
        );
      }
    }

    const orderNumber = await this.generateOrderNumber();

    const order = await this.orderRepository.create({
      orderNumber,
      customerName: dto.customerName,
      customerReference: dto.customerReference ?? null,
      deviceIds: uniqueDeviceIds,
      status: 'Draft',
      priority: dto.priority,
      notes: dto.notes ?? null,
      createdBy: userId,
      updatedBy: userId,
    });

    return this.toOrderResponse(order);
  }

  async search(
    params: OrderSearchParams,
  ): Promise<{ data: OrderResponse[]; meta: PaginationMeta }> {
    const filter = this.orderRepository.buildFilter(params);
    const pagination = parsePagination({ page: params.page, limit: params.limit });

    const sort: Record<string, 1 | -1> = {
      [params.sortBy]: params.sortOrder === 'asc' ? 1 : -1,
    };

    const [orders, total] = await Promise.all([
      this.orderRepository.search(filter, pagination.skip, pagination.limit, sort),
      this.orderRepository.count(filter),
    ]);

    return {
      data: orders.map((o) => this.toOrderResponse(o)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async update(id: string, dto: UpdateOrderDTO, userId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status === 'Cancelled' || order.status === 'Fulfilled') {
      throw new ValidationError('Cannot update a cancelled or fulfilled order');
    }

    const updateData: Record<string, unknown> = {
      updatedBy: userId,
    };

    if (dto.customerName !== undefined) {
      updateData.customerName = dto.customerName;
    }

    if (dto.customerReference !== undefined) {
      updateData.customerReference = dto.customerReference;
    }

    if (dto.priority !== undefined) {
      updateData.priority = dto.priority;
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    if (dto.deviceIds !== undefined) {
      const uniqueDeviceIds = [...new Set(dto.deviceIds)];

      const devices = await DeviceModel.find({
        _id: { $in: uniqueDeviceIds },
        isDeleted: { $ne: true },
      } as any).lean();

      if (devices.length !== uniqueDeviceIds.length) {
        throw new NotFoundError('One or more devices not found');
      }

      for (const device of devices) {
        if (device.status !== 'Available') {
          throw new ConflictError(
            `Device "${device.deviceName}" (${device.serialNumber}) is not available`,
          );
        }
      }

      for (const deviceId of uniqueDeviceIds) {
        const active = await this.orderRepository.findActiveByDeviceId(deviceId, id);

        if (active) {
          throw new ConflictError(
            `Device is already part of active order ${active.orderNumber}`,
          );
        }
      }

      updateData.deviceIds = uniqueDeviceIds;
    }

    if (order.status === 'Draft') {
      updateData.status = 'Pending';
    }

    const updated = await this.orderRepository.update(id, updateData);

    if (!updated) {
      throw new NotFoundError('Order not found after update');
    }

    return this.toOrderResponse(updated);
  }

  async cancel(id: string, userId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status === 'Fulfilled') {
      throw new ValidationError('Cannot cancel a fulfilled order');
    }

    if (order.status === 'Cancelled') {
      throw new ValidationError('Order is already cancelled');
    }

    const updateData: Record<string, unknown> = {
      status: 'Cancelled',
      updatedBy: userId,
    };

    if (order.pickListId) {
      const pickList = await PickListModel.findById(order.pickListId).lean();

      if (pickList && pickList.status !== 'Completed' && pickList.status !== 'Cancelled') {
        throw new ValidationError(
          'Cancel the linked pick list first before cancelling this order',
        );
      }
    }

    const updated = await this.orderRepository.update(id, updateData);

    if (!updated) {
      throw new NotFoundError('Order not found after update');
    }

    return this.toOrderResponse(updated);
  }

  async generatePickList(orderId: string, userId: string): Promise<OrderResponse> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const order = await OrderModel.findById(orderId).session(session).lean();

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (order.status !== 'Draft' && order.status !== 'Pending') {
        throw new ValidationError(
          `Cannot generate pick list for order with status "${order.status}". Order must be Draft or Pending.`,
        );
      }

      if (order.pickListId) {
        throw new ConflictError('Pick list already generated for this order');
      }

      const devices = await DeviceModel.find({
        _id: { $in: order.deviceIds },
        isDeleted: { $ne: true },
      } as any).session(session).lean();

      if (devices.length !== order.deviceIds.length) {
        throw new NotFoundError('One or more devices not found');
      }

      for (const device of devices) {
        if (device.status !== 'Available') {
          throw new ConflictError(
            `Device "${device.deviceName}" (${device.serialNumber}) is no longer available`,
          );
        }
      }

      const pickListNumber = await this.generatePickListNumber(session);

      const [pickList] = await PickListModel.create([{
        pickListNumber,
        workerId: null,
        deviceIds: order.deviceIds,
        status: 'Draft',
        priority: order.priority,
        notes: `Auto-generated from Order ${order.orderNumber}`,
        createdBy: userId,
        updatedBy: userId,
      } as any], { session });

      await DeviceModel.updateMany(
        { _id: { $in: order.deviceIds } } as any,
        { $set: { status: 'Reserved', updatedBy: userId } },
        { session },
      );

      const updated = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            status: 'Picking',
            pickListId: pickList._id.toString(),
            updatedBy: userId,
          },
        },
        { new: true, session },
      ).lean();

      if (!updated) {
        throw new NotFoundError('Order not found after update');
      }

      await session.commitTransaction();

      return this.toOrderResponse(updated);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async fulfill(id: string, userId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status !== 'Ready') {
      throw new ValidationError(
        `Cannot fulfill order with status "${order.status}". Order must be Ready.`,
      );
    }

    const updated = await this.orderRepository.update(id, {
      status: 'Fulfilled',
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Order not found after update');
    }

    return this.toOrderResponse(updated);
  }

  async onPickListCompleted(pickListId: string): Promise<void> {
    const order = await this.orderRepository.findByPickListId(pickListId);

    if (!order) {
      return;
    }

    if (order.status !== 'Picking') {
      return;
    }

    await this.orderRepository.update(order._id.toString(), {
      status: 'Ready',
      updatedBy: 'system',
    });
  }

  async onPickListCancelled(pickListId: string): Promise<void> {
    const order = await this.orderRepository.findByPickListId(pickListId);

    if (!order) {
      return;
    }

    if (order.status !== 'Picking') {
      return;
    }

    await this.orderRepository.update(order._id.toString(), {
      status: 'Pending',
      updatedBy: 'system',
    });
  }

  private async generateOrderNumber(session?: mongoose.ClientSession): Promise<string> {
    const last = await this.orderRepository.findLastOrder(session);

    let nextNum = 1;

    if (last && last.orderNumber) {
      const match = last.orderNumber.match(/ORD-(\d+)/);

      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    return `ORD-${String(nextNum).padStart(5, '0')}`;
  }

  private async generatePickListNumber(session?: mongoose.ClientSession): Promise<string> {
    const last = await PickListModel.findOne({})
      .sort({ pickListNumber: -1 })
      .session(session || null)
      .lean();

    let nextNum = 1;

    if (last && last.pickListNumber) {
      const match = last.pickListNumber.match(/PL-(\d+)/);

      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    return `PL-${String(nextNum).padStart(5, '0')}`;
  }

  private toOrderResponse(order: IOrder | Record<string, any>): OrderResponse {
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerReference: order.customerReference || undefined,
      deviceIds: order.deviceIds,
      status: order.status,
      priority: order.priority,
      notes: order.notes,
      pickListId: order.pickListId || undefined,
      createdBy: order.createdBy,
      updatedBy: order.updatedBy,
      createdAt: new Date(order.createdAt).toISOString(),
      updatedAt: new Date(order.updatedAt).toISOString(),
    };
  }
}
