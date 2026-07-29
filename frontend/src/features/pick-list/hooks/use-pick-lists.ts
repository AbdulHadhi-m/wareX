import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { pickListApi } from '../api/pick-list-api';
import type {
  PickListListParams,
  CreatePickListData,
  AssignPickListData,
} from '../types';

export function usePickLists(params?: PickListListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PICK_LISTS, params],
    queryFn: () => pickListApi.list(params),
  });
}

export function usePickList(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PICK_LISTS, id],
    queryFn: () => pickListApi.byId(id),
    enabled: !!id,
  });
}

export function usePickListsByWorker(
  workerId: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PICK_LISTS, 'worker', workerId, params],
    queryFn: () => pickListApi.byWorker(workerId, params),
    enabled: !!workerId,
  });
}

export function useCreatePickList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePickListData) => pickListApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PICK_LISTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Pick list created successfully');
      navigate('/pick-lists', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to create pick list';
      toast.error(message);
    },
  });
}

export function useAssignWorker(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignPickListData) => pickListApi.assign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PICK_LISTS });
      toast.success('Worker assigned successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to assign worker';
      toast.error(message);
    },
  });
}

export function useStartPickList(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => pickListApi.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PICK_LISTS });
      toast.success('Picking started');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to start picking';
      toast.error(message);
    },
  });
}

export function useCompletePickList(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => pickListApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PICK_LISTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Pick list completed');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to complete pick list';
      toast.error(message);
    },
  });
}

export function useCancelPickList(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => pickListApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PICK_LISTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Pick list cancelled');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to cancel pick list';
      toast.error(message);
    },
  });
}
