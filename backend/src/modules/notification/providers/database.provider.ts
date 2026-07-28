import { NotificationProvider } from '../notification.provider';
import { INotification } from '../notification.types';
import { NotificationRepository } from '../notification.repository';

export class DatabaseNotificationProvider implements NotificationProvider {
  readonly name = 'database';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_repository: NotificationRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async send(_notification: INotification): Promise<void> {
    // The notification is already persisted by the service.
    // This provider exists as a future extension point (e.g., email, SMS, push).
  }
}
