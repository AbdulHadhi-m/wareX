import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants';
import { notificationApi } from '../api/notification-api';
import type { NotificationListParams } from '../types';

export function useNotifications(params?: NotificationListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => notificationApi.list(params),
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, id],
    queryFn: () => notificationApi.byId(id),
    enabled: !!id,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, 'unread-count'],
    queryFn: () => notificationApi.unreadCount(),
    refetchInterval: 30000,
  });
}

export function useMarkAsRead(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to mark as read';
      toast.error(message);
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      toast.success('All notifications marked as read');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to mark all as read';
      toast.error(message);
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      toast.success('Notification deleted');
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      const message =
        axiosError?.response?.data?.error?.message ?? 'Failed to delete notification';
      toast.error(message);
    },
  });
}
