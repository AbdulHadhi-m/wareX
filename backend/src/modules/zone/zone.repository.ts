import { Types } from 'mongoose';
import { ZoneModel } from './zone.model';
import { IZone, CreateZoneDTO, UpdateZoneDTO } from './zone.types';
import { type MongoQuery } from '../../shared/query';

export class ZoneRepository {
  private baseFilter() {
    return { isDeleted: { $ne: true } };
  }

  async findAll(): Promise<IZone[]> {
    return ZoneModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
  }

  async search(query: MongoQuery): Promise<IZone[]> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = ZoneModel.find(filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    return ZoneModel.countDocuments(filter as any);
  }

  async findById(id: string): Promise<IZone | null> {
    return ZoneModel.findById(id).where('isDeleted').ne(true).lean();
  }

  async findByWarehouseId(warehouseId: string): Promise<IZone[]> {
    return ZoneModel.find({ warehouseId, ...this.baseFilter() }).sort({ createdAt: -1 }).lean();
  }

  async findByCodeInWarehouse(code: string, warehouseId: string): Promise<IZone | null> {
    return ZoneModel.findOne({
      code: code.toUpperCase(),
      warehouseId,
      ...this.baseFilter(),
    }).lean();
  }

  async findByCodeInWarehouseExcludingId(code: string, warehouseId: string, excludeId: string): Promise<IZone | null> {
    return ZoneModel.findOne({
      code: code.toUpperCase(),
      warehouseId,
      _id: { $ne: new Types.ObjectId(excludeId) },
      ...this.baseFilter(),
    } as any).lean();
  }

  async create(data: CreateZoneDTO & { createdBy: string; updatedBy: string }): Promise<IZone> {
    const zone = await ZoneModel.create(data);
    return zone.toObject();
  }

  async update(id: string, data: UpdateZoneDTO & { updatedBy: string }): Promise<IZone | null> {
    return ZoneModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .where('isDeleted').ne(true).lean();
  }

  async softDelete(id: string, updatedBy: string): Promise<IZone | null> {
    return ZoneModel.findByIdAndUpdate(
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
