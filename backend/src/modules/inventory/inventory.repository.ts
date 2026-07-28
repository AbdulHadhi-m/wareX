import mongoose from 'mongoose';
import { MovementHistoryModel } from './inventory.model';
import { IMovementHistory } from './inventory.types';

export class MovementHistoryRepository {
  async create(
    data: Record<string, unknown>,
    session?: mongoose.ClientSession,
  ): Promise<IMovementHistory> {
    const [doc] = await MovementHistoryModel.create([data], { session });
    return doc.toObject();
  }

  async findByDeviceId(deviceId: string): Promise<IMovementHistory[]> {
    return MovementHistoryModel.find({ deviceId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
  }

  async countByDeviceId(deviceId: string): Promise<number> {
    return MovementHistoryModel.countDocuments({ deviceId });
  }
}
