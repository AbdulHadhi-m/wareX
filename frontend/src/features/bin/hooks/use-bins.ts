import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { binApi } from '../api/bin-api';
import type {
  BinListParams,
  CreateBinData,
  UpdateBinData,
} from '../types';

export function useBins(params?: BinListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, params],
    queryFn: () => binApi.list(params),
  });
}

export function useBin(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, id],
    queryFn: () => binApi.byId(id),
    enabled: !!id,
  });
}

export function useBinsByAisle(aisleId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'aisle', aisleId],
    queryFn: () => binApi.byAisle(aisleId),
    enabled: !!aisleId,
  });
}

export function useWarehouses() {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'warehouses'],
    queryFn: () => binApi.warehouses(),
  });
}

export function useAllZones() {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'all-zones'],
    queryFn: () => binApi.allZones(),
  });
}

export function useAllAisles() {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'all-aisles'],
    queryFn: () => binApi.allAisles(),
  });
}

export function useZonesByWarehouse(warehouseId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'zones-by-warehouse', warehouseId],
    queryFn: () => binApi.zonesByWarehouse(warehouseId),
    enabled: !!warehouseId,
  });
}

export function useAislesByZone(zoneId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'aisles-by-zone', zoneId],
    queryFn: () => binApi.aislesByZone(zoneId),
    enabled: !!zoneId,
  });
}

export function useAisleById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'aisle', id],
    queryFn: () => binApi.aisleById(id),
    enabled: !!id,
  });
}

export function useZoneById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'zone', id],
    queryFn: () => binApi.zoneById(id),
    enabled: !!id,
  });
}

export function useWarehouseById(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BINS, 'warehouse', id],
    queryFn: () => binApi.warehouseById(id),
    enabled: !!id,
  });
}

export function useCreateBin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateBinData) => binApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BINS });
      toast.success('Bin created successfully');
      navigate('/bins', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to create bin';
      toast.error(message);
    },
  });
}

export function useUpdateBin(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateBinData) => binApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BINS });
      toast.success('Bin updated successfully');
      navigate('/bins', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to update bin';
      toast.error(message);
    },
  });
}

export function useDeleteBin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => binApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BINS });
      toast.success('Bin deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to delete bin';
      toast.error(message);
    },
  });
}
