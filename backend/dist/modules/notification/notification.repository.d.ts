import { INotification } from './notification.types';
export declare class NotificationRepository {
    private baseFilter;
    findById(id: string): Promise<INotification | null>;
    findByRecipient(recipientId: string, filter: Record<string, unknown>, skip: number, limit: number, sort: Record<string, 1 | -1>): Promise<INotification[]>;
    countByRecipient(recipientId: string, filter: Record<string, unknown>): Promise<number>;
    countUnread(recipientId: string): Promise<number>;
    create(data: Record<string, unknown>): Promise<INotification>;
    markAsRead(id: string): Promise<INotification | null>;
    markAllAsRead(recipientId: string): Promise<number>;
    softDelete(id: string): Promise<INotification | null>;
}
//# sourceMappingURL=notification.repository.d.ts.map