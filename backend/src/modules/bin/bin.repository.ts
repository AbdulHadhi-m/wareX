import { Types } from 'mongoose';
import { BinModel } from './bin.model';
import { IBin, CreateBinDTO, UpdateBinDTO } from './bin.types';
import { type MongoQuery } from '../../shared/query';

export class BinRepository {
  private baseFilter() {
    return { isDeleted: { $ne: true } };
  }

  async findAll(): Promise<IBin[]> {
    return BinModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
  }

  async search(query: MongoQuery): Promise<IBin[]> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = BinModel.find(filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    return BinModel.countDocuments(filter as any);
  }

  async findById(id: string): Promise<IBin | null> {
    return BinModel.findById(id).where('isDeleted').ne(true).lean();
  }

  async findByAisleId(aisleId: string): Promise<IBin[]> {
    return BinModel.find({ aisleId, ...this.baseFilter() }).sort({ createdAt: -1 }).lean();
  }

  async findByCodeInAisle(code: string, aisleId: string): Promise<IBin | null> {
    return BinModel.findOne({
      code: code.toUpperCase(),
      aisleId,
      ...this.baseFilter(),
    }).lean();
  }

  async findByCodeInAisleExcludingId(code: string, aisleId: string, excludeId: string): Promise<IBin | null> {
    return BinModel.findOne({
      code: code.toUpperCase(),
      aisleId,
      _id: { $ne: new Types.ObjectId(excludeId) },
      ...this.baseFilter(),
    } as any).lean();
  }

  async create(data: CreateBinDTO & { createdBy: string; updatedBy: string }): Promise<IBin> {
    const bin = await BinModel.create(data);
    return bin.toObject();
  }

  async update(id: string, data: UpdateBinDTO & { updatedBy: string }): Promise<IBin | null> {
    return BinModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .where('isDeleted').ne(true).lean();
  }

  async softDelete(id: string, updatedBy: string): Promise<IBin | null> {
    return BinModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedBy,
        },
      },
      { new: true },
    ).where('isDeleted').ne(true).lean();
  }
}
