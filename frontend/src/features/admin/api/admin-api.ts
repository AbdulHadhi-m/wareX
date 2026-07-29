import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { AdminUser, CreateUserData, UpdateUserData, UserListParams } from '../types';

export const adminApi = {
  list: (params?: UserListParams) =>
    api
      .get<ApiResponse<AdminUser[]> & { meta?: PaginationMeta }>('/admin/users', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`).then((r) => r.data.data!),

  create: (data: CreateUserData) =>
    api.post<ApiResponse<AdminUser>>('/admin/users', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateUserData) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, data).then((r) => r.data.data!),

  delete: (id: string) =>
    api.delete(`/admin/users/${id}`),
};
