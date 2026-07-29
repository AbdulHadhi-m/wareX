import mongoose from 'mongoose';
import { INotification } from './notification.types';
export type NotificationDocument = mongoose.Document & INotification;
export declare const NotificationModel: mongoose.Model<NotificationDocument, {}, {}, {}, mongoose.Document<unknown, {}, NotificationDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & INotification & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, NotificationDocument>;
//# sourceMappingURL=notification.model.d.ts.map