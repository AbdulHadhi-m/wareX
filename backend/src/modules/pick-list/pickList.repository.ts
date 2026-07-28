import mongoose from 'mongoose';
import { PickListModel } from './pickList.model';
import { IPickList } from './pickList.types';
import { type MongoQuery } from '../../shared/query';

export class PickListRepository {
  async findById(id: string): Promise<IPickList | null> {
    return PickListModel.findById(id).lean();
  }

  async findByPickListNumber(number: string): Promise<IPickList | null> {
    return PickListModel.findOne({ pickListNumber: number }).lean();
  }

  async search(query: MongoQuery): Promise<IPickList[]> {
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = PickListModel.find(query.filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    return PickListModel.countDocuments(query.filter as any);
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
      .select('pickListNumber status')
      .session(session || null)
      .lean();
  }

  async findLastPickList(session?: mongoose.ClientSession): Promise<IPickList | null> {
    return PickListModel.findOne({})
      .sort({ pickListNumber: -1 })
      .select('pickListNumber')
      .session(session || null)
      .lean();
  }

}
