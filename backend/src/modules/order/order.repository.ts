import mongoose from 'mongoose';
import { OrderModel } from './order.model';
import { IOrder, OrderSearchParams } from './order.types';

export class OrderRepository {
  async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id).lean();
  }

  async findByOrderNumber(number: string): Promise<IOrder | null> {
    return OrderModel.findOne({ orderNumber: number }).lean();
  }

  async findByPickListId(pickListId: string): Promise<IOrder | null> {
    return OrderModel.findOne({ pickListId }).lean();
  }

  async search(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>,
  ): Promise<IOrder[]> {
    return OrderModel.find(filter as any)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async count(filter: Record<string, unknown>): Promise<number> {
    return OrderModel.countDocuments(filter as any);
  }

  async create(
    data: Record<string, unknown>,
    session?: mongoose.ClientSession,
  ): Promise<IOrder> {
    const [doc] = await OrderModel.create([data], { session });
    return doc.toObject();
  }

  async update(
    id: string,
    data: Record<string, unknown>,
    session?: mongoose.ClientSession,
  ): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(id, { $set: data }, { new: true, session }).lean();
  }

  async findLastOrder(session?: mongoose.ClientSession): Promise<IOrder | null> {
    return OrderModel.findOne({})
      .sort({ orderNumber: -1 })
      .session(session || null)
      .lean();
  }

  async findActiveByDeviceId(
    deviceId: string,
    excludeOrderId?: string,
    session?: mongoose.ClientSession,
  ): Promise<IOrder | null> {
    const filter: Record<string, unknown> = {
      deviceIds: deviceId,
      status: { $in: ['Draft', 'Pending', 'Picking', 'Ready'] },
    };

    if (excludeOrderId) {
      filter._id = { $ne: excludeOrderId };
    }

    return OrderModel.findOne(filter as any)
      .session(session || null)
      .lean();
  }

  buildFilter(params: OrderSearchParams): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.customerName) {
      filter.customerName = { $regex: params.customerName, $options: 'i' };
    }

    return filter;
  }
}
