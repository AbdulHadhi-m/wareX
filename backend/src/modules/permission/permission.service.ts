import mongoose from 'mongoose';
import { PermissionRepository } from './permission.repository';
import { IPermission, CreatePermissionDTO, UpdatePermissionDTO, PermissionResponse } from './permission.types';
import { toPermissionResponse } from './permission.dto';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';

export class PermissionService {
  constructor(private readonly repository: PermissionRepository) {}

  async findAll(): Promise<PermissionResponse[]> {
    const permissions = await this.repository.findAll();
    return permissions.map(toPermissionResponse);
  }

  async findByModule(module: string): Promise<PermissionResponse[]> {
    const permissions = await this.repository.findByModule(module);
    return permissions.map(toPermissionResponse);
  }

  async findById(id: string): Promise<PermissionResponse> {
    const permission = await this.repository.findById(id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }
    return toPermissionResponse(permission);
  }

  async create(dto: CreatePermissionDTO): Promise<PermissionResponse> {
    const exists = await this.repository.existsByCode(dto.code);
    if (exists) {
      throw new ConflictError(`Permission with code "${dto.code}" already exists`);
    }

    const permission = await this.repository.create(dto);
    const obj = permission as unknown as IPermission;
    return toPermissionResponse(obj);
  }

  async update(id: string, dto: UpdatePermissionDTO): Promise<PermissionResponse> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Permission not found');
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundError('Permission not found');
    }

    const RoleModel = mongoose.model('Role');
    const rolesUsingPermission = await RoleModel.find({ permissions: id }).select('_id').lean();
    for (const role of rolesUsingPermission) {
      const { invalidatePermissionCache } = await import('../../shared/cache/permission-cache');
      invalidatePermissionCache(role._id.toString());
    }

    return toPermissionResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const permission = await this.repository.findById(id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    const RoleModel = mongoose.model('Role');
    const rolesUsingPermission = await RoleModel.countDocuments({ permissions: id });
    if (rolesUsingPermission > 0) {
      throw new ConflictError('Cannot delete permission that is assigned to roles');
    }

    await this.repository.delete(id);
  }
}
