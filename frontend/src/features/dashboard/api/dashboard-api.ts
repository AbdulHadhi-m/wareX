import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type {
  DashboardData,
  DeviceStatusItem,
  OrderItem,
  OrderStatusItem,
  PickListItem,
  NotificationItem,
  WarehouseUtilizationItem,
} from '../types';

export const dashboardApi = {
  summary: () =>
    api.get<ApiResponse<DashboardData>>('/dashboard').then((r) => r.data.data!),

  deviceStatus: (warehouseId?: string) =>
    api
      .get<ApiResponse<{ data: DeviceStatusItem[]; total: number }>>('/reports/device-status', {
        params: warehouseId ? { warehouseId } : undefined,
      })
      .then((r) => r.data.data!.data),

  orderStatus: (dateFrom?: string, dateTo?: string) =>
    api
      .get<ApiResponse<{ data: OrderStatusItem[]; total: number }>>('/reports/order-status', {
        params: dateFrom || dateTo ? { dateFrom, dateTo } : undefined,
      })
      .then((r) => r.data.data!.data),

  warehouseUtilization: () =>
    api
      .get<ApiResponse<{ data: WarehouseUtilizationItem[] }>>('/reports/warehouse-utilization')
      .then((r) => r.data.data!.data),

  recentOrders: (limit = 5) =>
    api
      .get<ApiResponse<OrderItem[]> & { meta?: PaginationMeta }>('/orders', {
        params: { page: 1, limit },
      })
      .then((r) => r.data.data!),

  recentPickLists: (limit = 5) =>
    api
      .get<ApiResponse<PickListItem[]> & { meta?: PaginationMeta }>('/pick-lists', {
        params: { page: 1, limit },
      })
      .then((r) => r.data.data!),

  recentNotifications: (limit = 5) =>
    api
      .get<ApiResponse<NotificationItem[]> & { meta?: PaginationMeta }>('/notifications', {
        params: { page: 1, limit, isRead: undefined },
      })
      .then((r) => r.data.data!),
};
