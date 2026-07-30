import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { inventoryApi } from '../api/inventory-api';
import type {
  InventoryListParams,
  MoveDeviceData,
} from '../types';
import type { QueryParams } from '../api/inventory-api';

function buildKey(
  mode: string,
  filterId: string | undefined,
  params: InventoryListParams,
) {
  return [
    ...QUERY_KEYS.INVENTORY,
    mode,
    filterId ?? 'all',
    { page: params.page, limit: params.limit, status: params.status, search: params.search },
  ] as const;
}

export function useInventory(params: InventoryListParams) {
  const hasSearch = !!params.search;
  const hasBin = !!params.binId;
  const hasAisle = !!params.aisleId;
  const hasZone = !!params.zoneId;
  const hasWarehouse = !!params.warehouseId;

  let mode: string;
  let filterId: string | undefined;

  if (hasSearch) {
    mode = 'search';
    filterId = params.search;
  } else if (hasBin) {
    mode = 'bin';
    filterId = params.binId;
  } else if (hasAisle) {
    mode = 'aisle';
    filterId = params.aisleId;
  } else if (hasZone) {
    mode = 'zone';
    filterId = params.zoneId;
  } else if (hasWarehouse) {
    mode = 'warehouse';
    filterId = params.warehouseId;
  } else {
    mode = 'all';
  }

  const queryKey = buildKey(mode, filterId, params);
  const qp: QueryParams = { page: params.page, limit: params.limit };

  return useQuery({
    queryKey,
    queryFn: () => {
      switch (mode) {
        case 'search':
          return inventoryApi.searchDevices(params.search!, qp);
        case 'bin':
          return inventoryApi.byBin(params.binId!, qp);
        case 'aisle':
          return inventoryApi.byAisle(params.aisleId!, qp);
        case 'zone':
          return inventoryApi.byZone(params.zoneId!, qp);
        case 'warehouse':
          return inventoryApi.byWarehouse(params.warehouseId!, qp);
        default:
          return inventoryApi.getAll(qp, params.status);
      }
    },
  });
}

export function useDeviceLocation(deviceId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'location', deviceId],
    queryFn: () => inventoryApi.deviceLocation(deviceId),
    enabled: !!deviceId,
  });
}

export function useDeviceHistory(deviceId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'history', deviceId],
    queryFn: () => inventoryApi.deviceHistory(deviceId),
    enabled: !!deviceId,
  });
}

export function useWarehousesForInventory() {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'warehouses'],
    queryFn: () => inventoryApi.warehouses(),
  });
}

export function useAllZones() {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'all-zones'],
    queryFn: () => inventoryApi.allZones(),
  });
}

export function useAllAisles() {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'all-aisles'],
    queryFn: () => inventoryApi.allAisles(),
  });
}

export function useAllBins() {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'all-bins'],
    queryFn: () => inventoryApi.allBins(),
  });
}

export function useZonesByWarehouse(warehouseId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'zones-by-warehouse', warehouseId],
    queryFn: () => inventoryApi.zonesByWarehouse(warehouseId),
    enabled: !!warehouseId,
  });
}

export function useAislesByZone(zoneId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'aisles-by-zone', zoneId],
    queryFn: () => inventoryApi.aislesByZone(zoneId),
    enabled: !!zoneId,
  });
}

export function useBinsByAisle(aisleId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVENTORY, 'bins-by-aisle', aisleId],
    queryFn: () => inventoryApi.binsByAisle(aisleId),
    enabled: !!aisleId,
  });
}

export function useMoveDevice() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: MoveDeviceData) => inventoryApi.move(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVENTORY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device moved successfully');
      navigate('/dashboard/inventory', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to move device';
      toast.error(message);
    },
  });
}
