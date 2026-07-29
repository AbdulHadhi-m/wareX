import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { Notification, NotificationListParams, UnreadCountResponse } from '../types';

export const notificationApi = {
  list: (params?: NotificationListParams) =>
    api
      .get<ApiResponse<Notification[]> & { meta?: PaginationMeta }>('/notifications', { params })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<Notification>>(`/notifications/${id}`).then((r) => r.data.data!),

  unreadCount: () =>
    api
      .get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count')
      .then((r) => r.data.data!.count),

  markAsRead: (id: string) =>
    api
      .patch<ApiResponse<Notification>>(`/notifications/${id}/read`)
      .then((r) => r.data.data!),

  markAllAsRead: () =>
    api.patch<ApiResponse<{ count: number }>>('/notifications/read-all').then((r) => r.data.data!),

  delete: (id: string) => api.delete(`/notifications/${id}`),
};
