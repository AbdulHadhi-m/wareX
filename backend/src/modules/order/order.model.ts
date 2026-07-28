import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.types';

export type OrderDocument = mongoose.Document & IOrder;

const orderSchema = new Schema<OrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    customerReference: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    deviceIds: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one device is required',
      },
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Picking', 'Ready', 'Fulfilled', 'Cancelled'],
      required: true,
      default: 'Draft',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    pickListId: {
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  },
);

orderSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerName: 1 });
orderSchema.index({ pickListId: 1 });
orderSchema.index({ createdAt: -1 });

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
