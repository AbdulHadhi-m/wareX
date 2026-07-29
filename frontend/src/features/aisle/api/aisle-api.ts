import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { Aisle, CreateAisleData, UpdateAisleData, AisleListParams, NamedEntity, ZoneInfo } from '../types';

export const aisleApi = {
  list: (params?: AisleListParams) =>
    api
      .get<ApiResponse<Aisle[]> & { meta?: PaginationMeta }>('/aisles', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Aisle>>(`/aisles/${id}`).then((r) => r.data.data!),

  byZone: (zoneId: string) =>
    api.get<ApiResponse<Aisle[]>>(`/zones/${zoneId}/aisles`).then((r) => r.data.data!),

  create: (data: CreateAisleData) =>
    api.post<ApiResponse<Aisle>>('/aisles', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateAisleData) =>
    api.patch<ApiResponse<Aisle>>(`/aisles/${id}`, data).then((r) => r.data.data!),

  delete: (id: string) => api.delete(`/aisles/${id}`),

  warehouses: () =>
    api.get<ApiResponse<NamedEntity[]>>('/warehouses').then((r) => r.data.data!),

  zonesByWarehouse: (warehouseId: string) =>
    api
      .get<ApiResponse<ZoneInfo[]>>(`/warehouses/${warehouseId}/zones`)
      .then((r) => r.data.data!),

  allZones: () =>
    api.get<ApiResponse<ZoneInfo[]>>('/zones').then((r) => r.data.data!),
};
