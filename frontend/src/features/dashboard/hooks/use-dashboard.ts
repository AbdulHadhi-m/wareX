import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { dashboardApi } from '../api/dashboard-api';

export function useDashboardSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.SUMMARY,
    queryFn: dashboardApi.summary,
  });
}

export function useDeviceStatusReport(warehouseId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.DEVICE_STATUS, warehouseId].filter(Boolean),
    queryFn: () => dashboardApi.deviceStatus(warehouseId),
  });
}

export function useOrderStatusReport(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.ORDER_STATUS, dateFrom, dateTo].filter(Boolean),
    queryFn: () => dashboardApi.orderStatus(dateFrom, dateTo),
  });
}

export function useWarehouseUtilization() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.WAREHOUSE_UTILIZATION,
    queryFn: dashboardApi.warehouseUtilization,
  });
}

export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.RECENT_ORDERS, limit],
    queryFn: () => dashboardApi.recentOrders(limit),
  });
}

export function useRecentPickLists(limit = 5) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.RECENT_PICK_LISTS, limit],
    queryFn: () => dashboardApi.recentPickLists(limit),
  });
}

export function useRecentNotifications(limit = 5) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.RECENT_NOTIFICATIONS, limit],
    queryFn: () => dashboardApi.recentNotifications(limit),
  });
}
