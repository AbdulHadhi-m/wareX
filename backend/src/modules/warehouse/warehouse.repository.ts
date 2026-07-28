import { Types } from 'mongoose';
import { WarehouseModel } from './warehouse.model';
import { IWarehouse, CreateWarehouseDTO, UpdateWarehouseDTO } from './warehouse.types';
import { type MongoQuery } from '../../shared/query';

export class WarehouseRepository {
  private baseFilter() {
    return { isDeleted: { $ne: true } };
  }

  async findAll(): Promise<IWarehouse[]> {
    return WarehouseModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
  }

  async search(query: MongoQuery): Promise<IWarehouse[]> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = WarehouseModel.find(filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    return WarehouseModel.countDocuments(filter as any);
  }

  async findById(id: string): Promise<IWarehouse | null> {
    return WarehouseModel.findById(id).where('isDeleted').ne(true).lean();
  }

  async findByCode(code: string): Promise<IWarehouse | null> {
    return WarehouseModel.findOne({ code: code.toUpperCase(), ...this.baseFilter() }).lean();
  }

  async findByCodeExcludingId(code: string, excludeId: string): Promise<IWarehouse | null> {
    return WarehouseModel.findOne({
      code: code.toUpperCase(),
      _id: { $ne: new Types.ObjectId(excludeId) },
      ...this.baseFilter(),
    } as any).lean();
  }

  async create(data: CreateWarehouseDTO & { createdBy: string; updatedBy: string }): Promise<IWarehouse> {
    const warehouse = await WarehouseModel.create(data);
    return warehouse.toObject();
  }

  async update(id: string, data: UpdateWarehouseDTO & { updatedBy: string }): Promise<IWarehouse | null> {
    return WarehouseModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .where('isDeleted').ne(true).lean();
  }

  async softDelete(id: string, updatedBy: string): Promise<IWarehouse | null> {
    return WarehouseModel.findByIdAndUpdate(
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
