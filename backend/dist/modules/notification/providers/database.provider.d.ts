import { NotificationProvider } from '../notification.provider';
import { INotification } from '../notification.types';
import { NotificationRepository } from '../notification.repository';
export declare class DatabaseNotificationProvider implements NotificationProvider {
    readonly name = "database";
    constructor(_repository: NotificationRepository);
    send(_notification: INotification): Promise<void>;
}
//# sourceMappingURL=database.provider.d.ts.map