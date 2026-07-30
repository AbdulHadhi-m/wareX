import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { Order, CreateOrderData, UpdateOrderData, OrderListParams } from '../types';
import type { Device } from '@/features/device/types';

export const orderApi = {
  list: (params?: OrderListParams) =>
    api
      .get<ApiResponse<Order[]> & { meta?: PaginationMeta }>('/orders', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data.data!),

  create: (data: CreateOrderData) =>
    api.post<ApiResponse<Order>>('/orders', data).then((r) => r.data.data!),

  update: (id: string, data: UpdateOrderData) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}`, data).then((r) => r.data.data!),

  cancel: (id: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`).then((r) => r.data.data!),

  generatePickList: (id: string) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/generate-pick-list`).then((r) => r.data.data!),

  fulfill: (id: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/fulfill`).then((r) => r.data.data!),

  searchDevices: (search?: string) =>
    api
      .get<ApiResponse<Device[]>>('/devices', {
        params: { search: search?.trim() || undefined, limit: 100, status: 'Available' },
      })
      .then((r) => r.data.data! ?? []),
};
