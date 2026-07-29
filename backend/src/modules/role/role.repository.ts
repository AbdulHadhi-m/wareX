import { RoleModel } from './role.model';
import { IRole, CreateRoleDTO, UpdateRoleDTO } from './role.types';

export class RoleRepository {
  async findAll(): Promise<IRole[]> {
    return RoleModel.find().populate('permissions').sort({ name: 1 }).lean();
  }

  async findById(id: string): Promise<IRole | null> {
    return RoleModel.findById(id).populate('permissions').lean();
  }

  async findByName(name: string): Promise<IRole | null> {
    return RoleModel.findOne({ name }).populate('permissions').lean();
  }

  async create(data: CreateRoleDTO): Promise<IRole> {
    const role = await RoleModel.create(data);
    return role.toObject() as unknown as IRole;
  }

  async update(id: string, data: UpdateRoleDTO): Promise<IRole | null> {
    return RoleModel.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('permissions').lean();
  }

  async delete(id: string): Promise<IRole | null> {
    return RoleModel.findByIdAndDelete(id).lean();
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await RoleModel.countDocuments({ name });
    return count > 0;
  }

  async count(): Promise<number> {
    return RoleModel.countDocuments();
  }
}
