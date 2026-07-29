import { PermissionModel } from './permission.model';
import { IPermission, CreatePermissionDTO, UpdatePermissionDTO } from './permission.types';

export class PermissionRepository {
  async findAll(): Promise<IPermission[]> {
    return PermissionModel.find().sort({ module: 1, code: 1 }).lean();
  }

  async findByModule(module: string): Promise<IPermission[]> {
    return PermissionModel.find({ module }).sort({ code: 1 }).lean();
  }

  async findById(id: string): Promise<IPermission | null> {
    return PermissionModel.findById(id).lean();
  }

  async findByCode(code: string): Promise<IPermission | null> {
    return PermissionModel.findOne({ code }).lean();
  }

  async create(data: CreatePermissionDTO): Promise<IPermission> {
    const permission = await PermissionModel.create(data);
    return permission.toObject() as unknown as IPermission;
  }

  async update(id: string, data: UpdatePermissionDTO): Promise<IPermission | null> {
    return PermissionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async delete(id: string): Promise<IPermission | null> {
    return PermissionModel.findByIdAndDelete(id).lean();
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await PermissionModel.countDocuments({ code });
    return count > 0;
  }

  async findByCodes(codes: string[]): Promise<IPermission[]> {
    return PermissionModel.find({ code: { $in: codes } }).lean();
  }
}
