import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { warehouseApi } from '../api/warehouse-api';
import type { WarehouseListParams, CreateWarehouseData, UpdateWarehouseData } from '../types';

export function useWarehouses(params?: WarehouseListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.WAREHOUSES, params],
    queryFn: () => warehouseApi.list(params),
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.WAREHOUSES, id],
    queryFn: () => warehouseApi.byId(id),
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateWarehouseData) => warehouseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES });
      toast.success('Warehouse created successfully');
      navigate('/warehouses', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to create warehouse';
      toast.error(message);
    },
  });
}

export function useUpdateWarehouse(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateWarehouseData) => warehouseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES });
      toast.success('Warehouse updated successfully');
      navigate('/warehouses', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to update warehouse';
      toast.error(message);
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => warehouseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES });
      toast.success('Warehouse deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to delete warehouse';
      toast.error(message);
    },
  });
}
