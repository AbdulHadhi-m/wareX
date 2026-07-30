import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { deviceApi } from '../api/device-api';
import type {
  DeviceListParams,
  CreateDeviceData,
  UpdateDeviceData,
} from '../types';

export function useDevices(params?: DeviceListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, params],
    queryFn: () => deviceApi.list(params),
  });
}

export function useDevice(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, id],
    queryFn: () => deviceApi.byId(id),
    enabled: !!id,
  });
}

export function useWarehousesForDevice() {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'warehouses'],
    queryFn: () => deviceApi.warehouses(),
  });
}

export function useAllZones() {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'all-zones'],
    queryFn: () => deviceApi.allZones(),
  });
}

export function useAllAisles() {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'all-aisles'],
    queryFn: () => deviceApi.allAisles(),
  });
}

export function useAllBins() {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'all-bins'],
    queryFn: () => deviceApi.allBins(),
  });
}

export function useZonesByWarehouse(warehouseId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'zones-by-warehouse', warehouseId],
    queryFn: () => deviceApi.zonesByWarehouse(warehouseId),
    enabled: !!warehouseId,
  });
}

export function useAislesByZone(zoneId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'aisles-by-zone', zoneId],
    queryFn: () => deviceApi.aislesByZone(zoneId),
    enabled: !!zoneId,
  });
}

export function useBinsByAisle(aisleId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'bins-by-aisle', aisleId],
    queryFn: () => deviceApi.binsByAisle(aisleId),
    enabled: !!aisleId,
  });
}

export function useWarehouseById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'warehouse', id],
    queryFn: () => deviceApi.warehouseById(id),
    enabled: !!id,
  });
}

export function useZoneById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'zone', id],
    queryFn: () => deviceApi.zoneById(id),
    enabled: !!id,
  });
}

export function useAisleById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'aisle', id],
    queryFn: () => deviceApi.aisleById(id),
    enabled: !!id,
  });
}

export function useBinById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEVICES, 'bin', id],
    queryFn: () => deviceApi.binById(id),
    enabled: !!id,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateDeviceData) => deviceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device registered successfully');
      navigate('/devices', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to register device';
      toast.error(message);
    },
  });
}

export function useUpdateDevice(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateDeviceData) => deviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device updated successfully');
      navigate('/devices', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to update device';
      toast.error(message);
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to delete device';
      toast.error(message);
    },
  });
}
