import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { AdminRepository } from './admin.repository';
import { ConflictError } from '../../shared/errors/conflict-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import type { PaginationMeta } from '../../shared/types/api-response';
import type { AdminUserResponse, CreateUserData, UpdateUserData, UserListParams } from './admin.types';

const SALT_ROUNDS = 12;

export class AdminService {
  constructor(private readonly repository: AdminRepository) {}

  async list(params: UserListParams): Promise<{ data: AdminUserResponse[]; meta: PaginationMeta }> {
    const pagination = parsePagination({ page: params.page, limit: params.limit });

    const [users, total] = await Promise.all([
      this.repository.findAll({ ...params, page: pagination.page, limit: pagination.limit }),
      this.repository.count(params),
    ]);

    return {
      data: users.map((u) => this.toResponse(u)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async getById(id: string): Promise<AdminUserResponse> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return this.toResponse(user);
  }

  async create(dto: CreateUserData): Promise<AdminUserResponse> {
    const exists = await this.repository.findByEmail(dto.email);
    if (exists) throw new ConflictError('A user with this email already exists');

    const RoleModel = mongoose.model('Role');
    const roleSearch = dto.roleId || dto.role;
    const isObjectId = mongoose.Types.ObjectId.isValid(roleSearch ?? '');

    const role = (await RoleModel.findOne({
      $or: [
        ...(isObjectId ? [{ _id: roleSearch }] : []),
        { name: roleSearch },
      ],
    }).lean()) as unknown as { _id: { toString(): string }; name: string } | null;

    if (!role) throw new NotFoundError('Role not found');

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.repository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      roleId: role._id.toString(),
      isActive: dto.isActive ?? true,
    });
    return this.toResponse(user);
  }

  async update(id: string, dto: UpdateUserData): Promise<AdminUserResponse> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('User not found');

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.repository.findByEmail(dto.email);
      if (emailExists) throw new ConflictError('A user with this email already exists');
    }

    const updateData: UpdateUserData & { password?: string; roleId?: string } = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const roleSearch = dto.roleId || dto.role;
    if (roleSearch) {
      const RoleModel = mongoose.model('Role');
      const isObjectId = mongoose.Types.ObjectId.isValid(roleSearch);

      const role = (await RoleModel.findOne({
        $or: [
          ...(isObjectId ? [{ _id: roleSearch }] : []),
          { name: roleSearch },
        ],
      }).lean()) as unknown as { _id: { toString(): string }; name: string } | null;

      if (!role) throw new NotFoundError('Role not found');
      updateData.roleId = role._id.toString();
    }

    if (dto.password && dto.password.trim().length >= 8) {
      updateData.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const updated = await this.repository.update(id, updateData);
    if (!updated) throw new NotFoundError('User not found');
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    await this.repository.delete(id);
  }

  private toResponse(user: Record<string, any>): AdminUserResponse {
    const roleObj = user.roleId as { name?: string; _id?: string } | undefined;
    const roleName = typeof user.roleId === 'object' && user.roleId?.name
      ? user.roleId.name
      : typeof user.roleId === 'string'
        ? user.roleId
        : 'Unknown';

    return {
      id: (user._id as string).toString(),
      name: user.name as string,
      email: user.email as string,
      role: roleObj?.name ?? roleName,
      roleId: (roleObj?._id ?? user.roleId ?? '').toString(),
      isActive: user.isActive ?? true,
      createdAt: (user.createdAt as Date).toISOString(),
      updatedAt: (user.updatedAt as Date).toISOString(),
    };
  }
}
