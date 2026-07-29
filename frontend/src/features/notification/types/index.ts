export type NotificationType =
  | 'Order Created'
  | 'Order Cancelled'
  | 'Order Fulfilled'
  | 'Pick List Assigned'
  | 'Pick List Started'
  | 'Pick List Completed'
  | 'Pick List Cancelled'
  | 'Device Reserved'
  | 'Device Moved'
  | 'Inventory Updated'
  | 'System';

export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  relatedModule?: string;
  relatedResourceId?: string;
  readAt?: string;
  createdAt: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface UnreadCountResponse {
  count: number;
}
