import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { Warehouse, CreateWarehouseData, UpdateWarehouseData, WarehouseListParams } from '../types';

export const warehouseApi = {
  list: (params?: WarehouseListParams) =>
    api
      .get<ApiResponse<Warehouse[]> & { meta?: PaginationMeta }>('/warehouses', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Warehouse>>(`/warehouses/${id}`).then((r) => r.data.data!),

  create: (data: CreateWarehouseData) =>
    api.post<ApiResponse<Warehouse>>('/warehouses', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateWarehouseData) =>
    api.patch<ApiResponse<Warehouse>>(`/warehouses/${id}`, data).then((r) => r.data.data!),

  delete: (id: string) =>
    api.delete(`/warehouses/${id}`),
};
