import { NotificationRepository } from './notification.repository';
import {
  CreateNotificationDTO,
  NotificationResponse,
  INotification,
} from './notification.types';
import { NotificationProvider } from './notification.provider';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { AuthorizationError } from '../../shared/errors/authorization-error';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';

export class NotificationService {
  private providers: NotificationProvider[] = [];

  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  registerProvider(provider: NotificationProvider): void {
    this.providers.push(provider);
  }

  async create(dto: CreateNotificationDTO): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.create({
      recipientId: dto.recipientId,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      priority: dto.priority,
      relatedModule: dto.relatedModule ?? null,
      relatedResourceId: dto.relatedResourceId ?? null,
    });

    for (const provider of this.providers) {
      try {
        await provider.send(notification);
      } catch {
        // Provider failure must never block the notification
      }
    }

    return this.toNotificationResponse(notification);
  }

  async findByRecipient(
    recipientId: string,
    filterParams: {
      isRead?: boolean;
      type?: string;
    },
    pageInput: { page?: number; limit?: number },
  ): Promise<{ data: NotificationResponse[]; meta: PaginationMeta }> {
    const filter: Record<string, unknown> = {};

    if (filterParams.isRead !== undefined) {
      filter.isRead = filterParams.isRead;
    }

    if (filterParams.type) {
      filter.type = filterParams.type;
    }

    const pagination = parsePagination(pageInput);

    const sort: Record<string, 1 | -1> = { createdAt: -1 };

    const [notifications, total] = await Promise.all([
      this.notificationRepository.findByRecipient(
        recipientId,
        filter,
        pagination.skip,
        pagination.limit,
        sort,
      ),
      this.notificationRepository.countByRecipient(recipientId, filter),
    ]);

    return {
      data: notifications.map((n) => this.toNotificationResponse(n)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string, userId: string): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.recipientId !== userId) {
      throw new AuthorizationError('You can only view your own notifications');
    }

    return this.toNotificationResponse(notification);
  }

  async markAsRead(id: string, userId: string): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.recipientId !== userId) {
      throw new AuthorizationError('You can only read your own notifications');
    }

    const updated = await this.notificationRepository.markAsRead(id);

    if (!updated) {
      throw new NotFoundError('Notification not found after update');
    }

    return this.toNotificationResponse(updated);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.recipientId !== userId) {
      throw new AuthorizationError('You can only delete your own notifications');
    }

    await this.notificationRepository.softDelete(id);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }

  private toNotificationResponse(notification: INotification): NotificationResponse {
    return {
      id: notification._id.toString(),
      recipientId: notification.recipientId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      isRead: notification.isRead,
      relatedModule: notification.relatedModule || undefined,
      relatedResourceId: notification.relatedResourceId || undefined,
      readAt: notification.readAt
        ? new Date(notification.readAt).toISOString()
        : undefined,
      createdAt: new Date(notification.createdAt).toISOString(),
    };
  }
}
