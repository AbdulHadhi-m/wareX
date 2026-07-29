import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { reportsApi } from '../api/reports-api';
import type { ReportFilters } from '../types';

export function useReportsDashboard() {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, 'dashboard'],
    queryFn: () => reportsApi.dashboard(),
  });
}

export function useDeviceStatusReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, 'device-status', filters],
    queryFn: () => reportsApi.deviceStatus(filters),
  });
}

export function useOrderStatusReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, 'order-status', filters],
    queryFn: () => reportsApi.orderStatus(filters),
  });
}

export function useWarehouseUtilization() {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, 'warehouse-utilization'],
    queryFn: () => reportsApi.warehouseUtilization(),
  });
}

export function usePickListPerformance(filters?: ReportFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, 'pick-list-performance', filters],
    queryFn: () => reportsApi.pickListPerformance(filters),
  });
}

export function useInventoryReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, 'inventory', filters],
    queryFn: () => reportsApi.inventoryReport(filters),
  });
}
