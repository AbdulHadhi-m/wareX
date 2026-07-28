import mongoose, { Schema } from 'mongoose';
import { IMovementHistory } from './inventory.types';

export type MovementHistoryDocument = mongoose.Document & IMovementHistory;

const movementHistorySchema = new Schema<MovementHistoryDocument>(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    fromWarehouseId: {
      type: String,
      default: null,
    },
    fromZoneId: {
      type: String,
      default: null,
    },
    fromAisleId: {
      type: String,
      default: null,
    },
    fromBinId: {
      type: String,
      default: null,
    },
    toWarehouseId: {
      type: String,
      required: true,
    },
    toZoneId: {
      type: String,
      required: true,
    },
    toAisleId: {
      type: String,
      required: true,
    },
    toBinId: {
      type: String,
      required: true,
    },
    movementType: {
      type: String,
      enum: ['Initial Placement', 'Transfer', 'Return', 'Adjustment'],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    performedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'movement_history',
  },
);

movementHistorySchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

movementHistorySchema.index({ deviceId: 1, createdAt: -1 });
movementHistorySchema.index({ toBinId: 1, createdAt: -1 });
movementHistorySchema.index({ toWarehouseId: 1, createdAt: -1 });
movementHistorySchema.index({ movementType: 1, createdAt: -1 });
movementHistorySchema.index({ performedBy: 1, createdAt: -1 });
movementHistorySchema.index({ toZoneId: 1, createdAt: -1 });
movementHistorySchema.index({ toAisleId: 1, createdAt: -1 });
movementHistorySchema.index({ movementType: 1 });

export const MovementHistoryModel = mongoose.model<MovementHistoryDocument>(
  'MovementHistory',
  movementHistorySchema,
);
