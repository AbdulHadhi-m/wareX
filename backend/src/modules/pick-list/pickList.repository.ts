import mongoose from 'mongoose';
import { PickListModel } from './pickList.model';
import { IPickList, PickListSearchParams } from './pickList.types';

export class PickListRepository {
  async findById(id: string): Promise<IPickList | null> {
    return PickListModel.findById(id).lean();
  }

  async findByPickListNumber(number: string): Promise<IPickList | null> {
    return PickListModel.findOne({ pickListNumber: number }).lean();
  }

  async search(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>,
  ): Promise<IPickList[]> {
    return PickListModel.find(filter as any)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async count(filter: Record<string, unknown>): Promise<number> {
    return PickListModel.countDocuments(filter as any);
  }

  async create(
    data: Record<string, unknown>,
    session?: mongoose.ClientSession,
  ): Promise<IPickList> {
    const [doc] = await PickListModel.create([data], { session });
    return doc.toObject();
  }

  async update(
    id: string,
    data: Record<string, unknown>,
    session?: mongoose.ClientSession,
  ): Promise<IPickList | null> {
    return PickListModel.findByIdAndUpdate(id, { $set: data }, { new: true, session }).lean();
  }

  async findActiveByDeviceId(
    deviceId: string,
    session?: mongoose.ClientSession,
  ): Promise<IPickList | null> {
    return PickListModel.findOne({
      deviceIds: deviceId,
      status: { $in: ['Draft', 'Assigned', 'In Progress'] },
    })
      .session(session || null)
      .lean();
  }

  async findLastPickList(session?: mongoose.ClientSession): Promise<IPickList | null> {
    return PickListModel.findOne({})
      .sort({ pickListNumber: -1 })
      .session(session || null)
      .lean();
  }

  buildFilter(params: PickListSearchParams): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.workerId) {
      filter.workerId = params.workerId;
    }

    if (params.startDate || params.endDate) {
      const createdAt: Record<string, unknown> = {};

      if (params.startDate) {
        createdAt.$gte = new Date(params.startDate);
      }

      if (params.endDate) {
        createdAt.$lte = new Date(params.endDate);
      }

      filter.createdAt = createdAt;
    }

    return filter;
  }
}
