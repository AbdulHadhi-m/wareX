import mongoose from 'mongoose';
import { UserModel } from '../auth/auth.model';
import type { CreateUserData, UpdateUserData, UserListParams } from './admin.types';

export class AdminRepository {
  async findAll(params: UserListParams) {
    const filter: Record<string, unknown> = {};

    if (params.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
      ];
    }

    if (params.roleId) {
      filter.roleId = new mongoose.Types.ObjectId(params.roleId);
    }

    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    return UserModel.find(filter)
      .populate('roleId')
      .sort({ [sortField]: sortOrder })
      .skip(((params.page ?? 1) - 1) * (params.limit ?? 10))
      .limit(params.limit ?? 10)
      .lean();
  }

  async count(params: UserListParams) {
    const filter: Record<string, unknown> = {};

    if (params.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
      ];
    }

    if (params.roleId) {
      filter.roleId = new mongoose.Types.ObjectId(params.roleId);
    }

    return UserModel.countDocuments(filter);
  }

  async findById(id: string) {
    return UserModel.findById(id).populate('roleId').lean();
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).populate('roleId').lean();
  }

  async create(data: CreateUserData & { password: string }) {
    const user = await UserModel.create(data);
    const obj = user.toObject();
    const { password: _, ...userWithoutPassword } = obj;
    return userWithoutPassword;
  }

  async update(id: string, data: UpdateUserData) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.roleId !== undefined) updateData.roleId = data.roleId;

    if (Object.keys(updateData).length === 0) return null;

    return UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('roleId')
      .lean();
  }

  async delete(id: string) {
    return UserModel.findByIdAndDelete(id).lean();
  }
}
