import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type {
  Device,
  CreateDeviceData,
  UpdateDeviceData,
  DeviceListParams,
  NamedEntity,
  ZoneOption,
  AisleOption,
  BinOption,
} from '../types';

export const deviceApi = {
  list: (params?: DeviceListParams) =>
    api
      .get<ApiResponse<Device[]> & { meta?: PaginationMeta }>('/devices', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Device>>(`/devices/${id}`).then((r) => r.data.data!),

  create: (data: CreateDeviceData) =>
    api.post<ApiResponse<Device>>('/devices', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateDeviceData) =>
    api.patch<ApiResponse<Device>>(`/devices/${id}`, data).then((r) => r.data.data!),

  delete: (id: string) => api.delete(`/devices/${id}`),

  warehouses: () =>
    api.get<ApiResponse<NamedEntity[]>>('/warehouses', { params: { limit: 1000 } }).then((r) => r.data.data!),

  allZones: () =>
    api.get<ApiResponse<ZoneOption[]>>('/zones', { params: { limit: 1000 } }).then((r) => r.data.data!),

  allAisles: () =>
    api.get<ApiResponse<AisleOption[]>>('/aisles', { params: { limit: 1000 } }).then((r) => r.data.data!),

  allBins: () =>
    api.get<ApiResponse<BinOption[]>>('/bins', { params: { limit: 1000 } }).then((r) => r.data.data!),

  zonesByWarehouse: (warehouseId: string) =>
    api
      .get<ApiResponse<ZoneOption[]>>(`/warehouses/${warehouseId}/zones`)
      .then((r) => r.data.data!),

  aislesByZone: (zoneId: string) =>
    api
      .get<ApiResponse<AisleOption[]>>(`/zones/${zoneId}/aisles`)
      .then((r) => r.data.data!),

  binsByAisle: (aisleId: string) =>
    api
      .get<ApiResponse<BinOption[]>>(`/aisles/${aisleId}/bins`)
      .then((r) => r.data.data!),

  warehouseById: (id: string) =>
    api.get<ApiResponse<NamedEntity>>(`/warehouses/${id}`).then((r) => r.data.data!),

  zoneById: (id: string) =>
    api.get<ApiResponse<ZoneOption>>(`/zones/${id}`).then((r) => r.data.data!),

  aisleById: (id: string) =>
    api
      .get<ApiResponse<AisleOption>>(`/aisles/${id}`)
      .then((r) => r.data.data!),

  binById: (id: string) =>
    api.get<ApiResponse<BinOption>>(`/bins/${id}`).then((r) => r.data.data!),
};
