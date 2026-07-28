import mongoose from 'mongoose';
import { OrderModel } from './order.model';
import { IOrder } from './order.types';
import { type MongoQuery } from '../../shared/query';

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

  async search(query: MongoQuery): Promise<IOrder[]> {
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = OrderModel.find(query.filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    return OrderModel.countDocuments(query.filter as any);
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

}
