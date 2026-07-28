import mongoose, { Schema } from 'mongoose';
import { IZone } from './zone.types';

export type ZoneDocument = mongoose.Document & IZone;

const zoneSchema = new Schema<ZoneDocument>(
  {
    warehouseId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
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
    timestamps: true,
    collection: 'zones',
  },
);

zoneSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

zoneSchema.index({ warehouseId: 1, code: 1, isDeleted: 1 }, { unique: true });
zoneSchema.index({ warehouseId: 1, isDeleted: 1 });

export const ZoneModel = mongoose.model<ZoneDocument>('Zone', zoneSchema);
