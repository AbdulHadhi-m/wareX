import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type {
  Bin,
  CreateBinData,
  UpdateBinData,
  BinListParams,
  NamedEntity,
  ZoneOption,
  AisleOption,
} from '../types';

export const binApi = {
  list: (params?: BinListParams) =>
    api
      .get<ApiResponse<Bin[]> & { meta?: PaginationMeta }>('/bins', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Bin>>(`/bins/${id}`).then((r) => r.data.data!),

  byAisle: (aisleId: string) =>
    api
      .get<ApiResponse<Bin[]>>(`/aisles/${aisleId}/bins`)
      .then((r) => r.data.data!),

  create: (data: CreateBinData) =>
    api.post<ApiResponse<Bin>>('/bins', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateBinData) =>
    api.patch<ApiResponse<Bin>>(`/bins/${id}`, data).then((r) => r.data.data!),

  delete: (id: string) => api.delete(`/bins/${id}`),

  warehouses: () =>
    api.get<ApiResponse<NamedEntity[]>>('/warehouses').then((r) => r.data.data!),

  zonesByWarehouse: (warehouseId: string) =>
    api
      .get<ApiResponse<ZoneOption[]>>(`/warehouses/${warehouseId}/zones`)
      .then((r) => r.data.data!),

  aislesByZone: (zoneId: string) =>
    api
      .get<ApiResponse<AisleOption[]>>(`/zones/${zoneId}/aisles`)
      .then((r) => r.data.data!),

  aisleById: (id: string) =>
    api.get<ApiResponse<AisleOption>>(`/aisles/${id}`).then((r) => r.data.data!),

  zoneById: (id: string) =>
    api.get<ApiResponse<ZoneOption>>(`/zones/${id}`).then((r) => r.data.data!),

  warehouseById: (id: string) =>
    api
      .get<ApiResponse<NamedEntity>>(`/warehouses/${id}`)
      .then((r) => r.data.data!),
};
