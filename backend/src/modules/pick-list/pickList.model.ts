import mongoose, { Schema } from 'mongoose';
import { IPickList } from './pickList.types';

export type PickListDocument = mongoose.Document & IPickList;

const pickListSchema = new Schema<PickListDocument>(
  {
    pickListNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    workerId: {
      type: String,
      default: null,
      index: true,
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
      enum: ['Draft', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
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
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'pick_lists',
  },
);

pickListSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

pickListSchema.index({ status: 1, createdAt: -1 });
pickListSchema.index({ workerId: 1, status: 1 });
pickListSchema.index({ createdAt: -1 });
pickListSchema.index({ deviceIds: 1 });

export const PickListModel = mongoose.model<PickListDocument>('PickList', pickListSchema);
