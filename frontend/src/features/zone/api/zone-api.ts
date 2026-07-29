import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { Zone, CreateZoneData, UpdateZoneData, ZoneListParams, WarehouseOption } from '../types';

export const zoneApi = {
  list: (params?: ZoneListParams) =>
    api
      .get<ApiResponse<Zone[]> & { meta?: PaginationMeta }>('/zones', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Zone>>(`/zones/${id}`).then((r) => r.data.data!),

  byWarehouse: (warehouseId: string) =>
    api
      .get<ApiResponse<Zone[]>>(`/warehouses/${warehouseId}/zones`)
      .then((r) => r.data.data!),

  create: (data: CreateZoneData) =>
    api.post<ApiResponse<Zone>>('/zones', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateZoneData) =>
    api.patch<ApiResponse<Zone>>(`/zones/${id}`, data).then((r) => r.data.data!),

  delete: (id: string) => api.delete(`/zones/${id}`),

  warehouses: () =>
    api.get<ApiResponse<WarehouseOption[]>>('/warehouses').then((r) => r.data.data!),
};
