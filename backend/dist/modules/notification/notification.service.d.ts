import { NotificationRepository } from './notification.repository';
import { CreateNotificationDTO, NotificationResponse } from './notification.types';
import { NotificationProvider } from './notification.provider';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class NotificationService {
    private readonly notificationRepository;
    private providers;
    constructor(notificationRepository: NotificationRepository);
    registerProvider(provider: NotificationProvider): void;
    create(dto: CreateNotificationDTO): Promise<NotificationResponse>;
    findByRecipient(recipientId: string, filterParams: {
        isRead?: boolean;
        type?: string;
    }, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: NotificationResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string, userId: string): Promise<NotificationResponse>;
    markAsRead(id: string, userId: string): Promise<NotificationResponse>;
    markAllAsRead(userId: string): Promise<number>;
    delete(id: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    private toNotificationResponse;
}
//# sourceMappingURL=notification.service.d.ts.map