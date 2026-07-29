import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { orderApi } from '../api/order-api';
import type { OrderListParams, CreateOrderData, UpdateOrderData } from '../types';

export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, params],
    queryFn: () => orderApi.list(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, id],
    queryFn: () => orderApi.byId(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
      toast.success('Order created successfully');
      navigate('/orders', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to create order';
      toast.error(message);
    },
  });
}

export function useUpdateOrder(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateOrderData) => orderApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
      toast.success('Order updated successfully');
      navigate('/orders', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to update order';
      toast.error(message);
    },
  });
}

export function useCancelOrder(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
      toast.success('Order cancelled successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to cancel order';
      toast.error(message);
    },
  });
}

export function useGeneratePickList(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderApi.generatePickList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PICK_LISTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
      toast.success('Pick list generated successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to generate pick list';
      toast.error(message);
    },
  });
}

export function useFulfillOrder(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderApi.fulfill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
      toast.success('Order fulfilled successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to fulfill order';
      toast.error(message);
    },
  });
}

export function useDevicesForSelect() {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, 'available-devices'],
    queryFn: () => orderApi.searchDevices(''),
    enabled: false,
    staleTime: 0,
  });
}
