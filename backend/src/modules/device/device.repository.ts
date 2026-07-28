import { DeviceModel } from './device.model';
import { IDevice } from './device.types';
import { type MongoQuery } from '../../shared/query';

export class DeviceRepository {
  private baseFilter() {
    return { isDeleted: { $ne: true } };
  }

  async findById(id: string): Promise<IDevice | null> {
    return DeviceModel.findById(id).where('isDeleted').ne(true).lean();
  }

  async findBySerialNumber(serialNumber: string): Promise<IDevice | null> {
    return DeviceModel.findOne({ serialNumber, ...this.baseFilter() }).lean();
  }

  async findByImei(imei: string): Promise<IDevice | null> {
    return DeviceModel.findOne({ imei, ...this.baseFilter() }).lean();
  }

  async search(query: MongoQuery): Promise<IDevice[]> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
    let q = DeviceModel.find(filter as any).sort(query.sort).skip(query.skip).limit(query.limit);
    if (projection) {
      q = q.select(projection);
    }
    return q.lean();
  }

  async countSearch(query: MongoQuery): Promise<number> {
    const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
    return DeviceModel.countDocuments(filter as any);
  }

  async create(data: Record<string, unknown>): Promise<IDevice> {
    const device = await DeviceModel.create(data as any);
    const obj = device.toObject();
    return obj as unknown as IDevice;
  }

  async update(id: string, data: Record<string, unknown>): Promise<IDevice | null> {
    return DeviceModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .where('isDeleted').ne(true).lean();
  }

  async softDelete(id: string, updatedBy: string): Promise<IDevice | null> {
    return DeviceModel.findByIdAndUpdate(
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
