import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@/constants';
import { adminApi } from '../api/admin-api';
import type { UserListParams, CreateUserData, UpdateUserData } from '../types';

export function useAdminUsers(params?: UserListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_USERS, params],
    queryFn: () => adminApi.list(params),
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_USERS, id],
    queryFn: () => adminApi.byId(id),
    enabled: !!id,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateUserData) => adminApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS });
      toast.success('User created successfully');
      navigate('/admin/users', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to create user';
      toast.error(message);
    },
  });
}

export function useUpdateAdminUser(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateUserData) => adminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS });
      toast.success('User updated successfully');
      navigate('/admin/users', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to update user';
      toast.error(message);
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS });
      toast.success('User deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError?.response?.data?.error?.message ?? 'Failed to delete user';
      toast.error(message);
    },
  });
}
