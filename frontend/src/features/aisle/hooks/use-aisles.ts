import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { aisleApi } from '../api/aisle-api';
import type { AisleListParams, CreateAisleData, UpdateAisleData } from '../types';

export function useAisles(params?: AisleListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.AISLES, params],
    queryFn: () => aisleApi.list(params),
  });
}

export function useAisle(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.AISLES, id],
    queryFn: () => aisleApi.byId(id),
    enabled: !!id,
  });
}

export function useAislesByZone(zoneId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.AISLES, 'zone', zoneId],
    queryFn: () => aisleApi.byZone(zoneId),
    enabled: !!zoneId,
  });
}

export function useWarehousesForAisle() {
  return useQuery({
    queryKey: [...QUERY_KEYS.AISLES, 'warehouses'],
    queryFn: () => aisleApi.warehouses(),
  });
}

export function useZonesByWarehouse(warehouseId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.AISLES, 'zones-by-warehouse', warehouseId],
    queryFn: () => aisleApi.zonesByWarehouse(warehouseId),
    enabled: !!warehouseId,
  });
}

export function useAllZones() {
  return useQuery({
    queryKey: [...QUERY_KEYS.AISLES, 'all-zones'],
    queryFn: () => aisleApi.allZones(),
  });
}

export function useCreateAisle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateAisleData) => aisleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AISLES });
      toast.success('Aisle created successfully');
      navigate('/aisles', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to create aisle';
      toast.error(message);
    },
  });
}

export function useUpdateAisle(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateAisleData) => aisleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AISLES });
      toast.success('Aisle updated successfully');
      navigate('/aisles', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to update aisle';
      toast.error(message);
    },
  });
}

export function useDeleteAisle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aisleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AISLES });
      toast.success('Aisle deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to delete aisle';
      toast.error(message);
    },
  });
}
