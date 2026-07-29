import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { zoneApi } from '../api/zone-api';
import type { ZoneListParams, CreateZoneData, UpdateZoneData } from '../types';

export function useZones(params?: ZoneListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ZONES, params],
    queryFn: () => zoneApi.list(params),
  });
}

export function useZone(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ZONES, id],
    queryFn: () => zoneApi.byId(id),
    enabled: !!id,
  });
}

export function useZonesByWarehouse(warehouseId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ZONES, 'warehouse', warehouseId],
    queryFn: () => zoneApi.byWarehouse(warehouseId),
    enabled: !!warehouseId,
  });
}

export function useWarehousesForSelect() {
  return useQuery({
    queryKey: [...QUERY_KEYS.ZONES, 'warehouses'],
    queryFn: () => zoneApi.warehouses(),
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateZoneData) => zoneApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ZONES });
      toast.success('Zone created successfully');
      navigate('/zones', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to create zone';
      toast.error(message);
    },
  });
}

export function useUpdateZone(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateZoneData) => zoneApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ZONES });
      toast.success('Zone updated successfully');
      navigate('/zones', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to update zone';
      toast.error(message);
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => zoneApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ZONES });
      toast.success('Zone deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to delete zone';
      toast.error(message);
    },
  });
}
