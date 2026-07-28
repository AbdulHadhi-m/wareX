import { INotification } from './notification.types';

export interface NotificationProvider {
  readonly name: string;
  send(notification: INotification): Promise<void>;
}
