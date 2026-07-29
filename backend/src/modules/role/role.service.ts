import { RoleRepository } from './role.repository';
import { CreateRoleDTO, UpdateRoleDTO, RoleResponse } from './role.types';
import { toRoleResponse, toRoleResponsePopulated } from './role.dto';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { invalidatePermissionCache } from '../../shared/cache/permission-cache';

export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  async findAll(): Promise<RoleResponse[]> {
    const roles = await this.repository.findAll();
    return roles.map(toRoleResponsePopulated);
  }

  async findById(id: string): Promise<RoleResponse> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }
    return toRoleResponsePopulated(role);
  }

  async create(dto: CreateRoleDTO): Promise<RoleResponse> {
    const exists = await this.repository.existsByName(dto.name);
    if (exists) {
      throw new ConflictError(`Role with name "${dto.name}" already exists`);
    }

    const role = await this.repository.create(dto);
    const plain = role as unknown as { _id: string; name: string; description: string; permissions: string[]; isSuperAdmin: boolean; createdAt: Date; updatedAt: Date };
    return toRoleResponse(plain);
  }

  async update(id: string, dto: UpdateRoleDTO): Promise<RoleResponse> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Role not found');
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundError('Role not found');
    }

    invalidatePermissionCache(id);

    return toRoleResponsePopulated(updated);
  }

  async delete(id: string): Promise<void> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    const mongoose = (await import('mongoose')).default;
    const userCount = await mongoose.model('User').countDocuments({ roleId: id });
    if (userCount > 0) {
      throw new ConflictError('Cannot delete role that is assigned to users');
    }

    await this.repository.delete(id);
    invalidatePermissionCache(id);
  }
}
