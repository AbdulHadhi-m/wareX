"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const authorization_error_1 = require("../../shared/errors/authorization-error");
const pagination_1 = require("../../shared/utils/pagination");
class NotificationService {
    notificationRepository;
    providers = [];
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    registerProvider(provider) {
        this.providers.push(provider);
    }
    async create(dto) {
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
            }
            catch {
                // Provider failure must never block the notification
            }
        }
        return this.toNotificationResponse(notification);
    }
    async findByRecipient(recipientId, filterParams, pageInput) {
        const filter = {};
        if (filterParams.isRead !== undefined) {
            filter.isRead = filterParams.isRead;
        }
        if (filterParams.type) {
            filter.type = filterParams.type;
        }
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const sort = { createdAt: -1 };
        const [notifications, total] = await Promise.all([
            this.notificationRepository.findByRecipient(recipientId, filter, pagination.skip, pagination.limit, sort),
            this.notificationRepository.countByRecipient(recipientId, filter),
        ]);
        return {
            data: notifications.map((n) => this.toNotificationResponse(n)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id, userId) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new not_found_error_1.NotFoundError('Notification not found');
        }
        if (notification.recipientId !== userId) {
            throw new authorization_error_1.AuthorizationError('You can only view your own notifications');
        }
        return this.toNotificationResponse(notification);
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new not_found_error_1.NotFoundError('Notification not found');
        }
        if (notification.recipientId !== userId) {
            throw new authorization_error_1.AuthorizationError('You can only read your own notifications');
        }
        const updated = await this.notificationRepository.markAsRead(id);
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Notification not found after update');
        }
        return this.toNotificationResponse(updated);
    }
    async markAllAsRead(userId) {
        return this.notificationRepository.markAllAsRead(userId);
    }
    async delete(id, userId) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new not_found_error_1.NotFoundError('Notification not found');
        }
        if (notification.recipientId !== userId) {
            throw new authorization_error_1.AuthorizationError('You can only delete your own notifications');
        }
        await this.notificationRepository.softDelete(id);
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.countUnread(userId);
    }
    toNotificationResponse(notification) {
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
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map