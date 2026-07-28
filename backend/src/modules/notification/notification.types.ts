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

export interface INotification {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  relatedModule?: string;
  relatedResourceId?: string;
  readAt?: Date;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface CreateNotificationDTO {
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  relatedModule?: string;
  relatedResourceId?: string;
}

export interface NotificationResponse {
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

export interface UnreadCountResponse {
  count: number;
}
