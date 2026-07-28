import mongoose, { Schema } from 'mongoose';
import { INotification } from './notification.types';

export type NotificationDocument = mongoose.Document & INotification;

const notificationSchema = new Schema<NotificationDocument>(
  {
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: [
        'Order Created',
        'Order Cancelled',
        'Order Fulfilled',
        'Pick List Assigned',
        'Pick List Started',
        'Pick List Completed',
        'Pick List Cancelled',
        'Device Reserved',
        'Device Moved',
        'Inventory Updated',
        'System',
      ],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
      default: 'Medium',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedModule: {
      type: String,
      default: null,
    },
    relatedResourceId: {
      type: String,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'notifications',
  },
);

notificationSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isDeleted: 1 });

export const NotificationModel = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema,
);
