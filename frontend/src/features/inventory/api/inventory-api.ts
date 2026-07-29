import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type {
  InventoryDevice,
  DeviceLocationResponse,
  MovementHistoryRecord,
  MoveDeviceData,
  NamedEntity,
  ZoneOption,
  AisleOption,
  BinOption,
} from '../types';

export interface QueryParams {
  page?: number;
  limit?: number;
}

export const inventoryApi = {
  move: (data: MoveDeviceData) =>
    api
      .post<ApiResponse<MovementHistoryRecord>>('/inventory/move', data)
      .then((r) => r.data.data!),

  getAll: (params?: QueryParams, status?: string) =>
    api
      .get<ApiResponse<InventoryDevice[]> & { meta?: PaginationMeta }>(
        '/inventory',
        { params: { ...params, status: status || undefined } },
      )
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byWarehouse: (warehouseId: string, params?: QueryParams) =>
    api
      .get<ApiResponse<InventoryDevice[]> & { meta?: PaginationMeta }>(
        `/inventory/warehouse/${warehouseId}`,
        { params },
      )
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byZone: (zoneId: string, params?: QueryParams) =>
    api
      .get<ApiResponse<InventoryDevice[]> & { meta?: PaginationMeta }>(
        `/inventory/zone/${zoneId}`,
        { params },
      )
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byAisle: (aisleId: string, params?: QueryParams) =>
    api
      .get<ApiResponse<InventoryDevice[]> & { meta?: PaginationMeta }>(
        `/inventory/aisle/${aisleId}`,
        { params },
      )
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byBin: (binId: string, params?: QueryParams) =>
    api
      .get<ApiResponse<InventoryDevice[]> & { meta?: PaginationMeta }>(
        `/inventory/bin/${binId}`,
        { params },
      )
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  deviceLocation: (deviceId: string) =>
    api
      .get<ApiResponse<DeviceLocationResponse>>(`/inventory/device/${deviceId}`)
      .then((r) => r.data.data!),

  deviceHistory: (deviceId: string) =>
    api
      .get<ApiResponse<MovementHistoryRecord[]>>(
        `/inventory/device/${deviceId}/history`,
      )
      .then((r) => r.data.data!),

  searchDevices: (search: string, params?: QueryParams) =>
    api
      .get<ApiResponse<InventoryDevice[]> & { meta?: PaginationMeta }>('/devices', {
        params: { search: search || undefined, ...params },
      })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

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

  binsByAisle: (aisleId: string) =>
    api
      .get<ApiResponse<BinOption[]>>(`/aisles/${aisleId}/bins`)
      .then((r) => r.data.data!),
};
