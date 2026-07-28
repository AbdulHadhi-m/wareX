import { Types } from 'mongoose';
import { AisleModel } from './aisle.model';
import { IAisle, CreateAisleDTO, UpdateAisleDTO } from './aisle.types';
import { type MongoQuery } from '../../shared/query';

export class AisleRepository {
  private baseFilter() {
    return { isDeleted: { $ne: true } };
  }

  async findAll(): Promise<IAisle[]> {
    return AisleModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
  }

  async search(query: MongoQuery): Promise<IAisle[]> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = AisleModel.find(filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    return AisleModel.countDocuments(filter as any);
  }

  async findById(id: string): Promise<IAisle | null> {
    return AisleModel.findById(id).where('isDeleted').ne(true).lean();
  }

  async findByZoneId(zoneId: string): Promise<IAisle[]> {
    return AisleModel.find({ zoneId, ...this.baseFilter() }).sort({ createdAt: -1 }).lean();
  }

  async findByCodeInZone(code: string, zoneId: string): Promise<IAisle | null> {
    return AisleModel.findOne({
      code: code.toUpperCase(),
      zoneId,
      ...this.baseFilter(),
    }).lean();
  }

  async findByCodeInZoneExcludingId(code: string, zoneId: string, excludeId: string): Promise<IAisle | null> {
    return AisleModel.findOne({
      code: code.toUpperCase(),
      zoneId,
      _id: { $ne: new Types.ObjectId(excludeId) },
      ...this.baseFilter(),
    } as any).lean();
  }

  async create(data: CreateAisleDTO & { createdBy: string; updatedBy: string }): Promise<IAisle> {
    const aisle = await AisleModel.create(data);
    return aisle.toObject();
  }

  async update(id: string, data: UpdateAisleDTO & { updatedBy: string }): Promise<IAisle | null> {
    return AisleModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .where('isDeleted').ne(true).lean();
  }

  async softDelete(id: string, updatedBy: string): Promise<IAisle | null> {
    return AisleModel.findByIdAndUpdate(
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
