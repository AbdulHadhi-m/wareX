import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  DashboardData,
  DeviceStatusItem,
  OrderStatusItem,
  WarehouseUtilizationItem,
  PickListPerformanceItem,
  PickListPerformanceSummary,
  InventoryReportItem,
  ReportFilters,
} from '../types';

export const reportsApi = {
  dashboard: () =>
    api.get<ApiResponse<DashboardData>>('/dashboard').then((r) => r.data.data!),

  deviceStatus: (params?: ReportFilters) =>
    api
      .get<ApiResponse<{ data: DeviceStatusItem[]; total: number }>>('/reports/device-status', {
        params,
      })
      .then((r) => r.data.data!.data),

  orderStatus: (params?: ReportFilters) =>
    api
      .get<ApiResponse<{ data: OrderStatusItem[]; total: number }>>('/reports/order-status', {
        params: params?.dateFrom || params?.dateTo ? { dateFrom: params.dateFrom, dateTo: params.dateTo } : undefined,
      })
      .then((r) => r.data.data!.data),

  warehouseUtilization: () =>
    api
      .get<ApiResponse<{ data: WarehouseUtilizationItem[] }>>('/reports/warehouse-utilization')
      .then((r) => r.data.data!.data),

  pickListPerformance: (params?: ReportFilters) =>
    api
      .get<
        ApiResponse<{
          data: PickListPerformanceItem[];
          summary: PickListPerformanceSummary;
        }>
      >('/reports/pick-list-performance', {
        params: params?.dateFrom || params?.dateTo || params?.warehouseId
          ? { dateFrom: params.dateFrom, dateTo: params.dateTo, workerId: params.warehouseId }
          : undefined,
      })
      .then((r) => r.data.data!),

  inventoryReport: (params?: ReportFilters) =>
    api
      .get<ApiResponse<{ data: InventoryReportItem[]; total: number }>>('/reports/inventory', {
        params,
      })
      .then((r) => ({ data: r.data.data!.data, total: r.data.data!.total })),
};
