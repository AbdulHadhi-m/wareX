import mongoose, { Schema } from 'mongoose';
import { IAisle } from './aisle.types';

export type AisleDocument = mongoose.Document & IAisle;

const aisleSchema = new Schema<AisleDocument>(
  {
    zoneId: {
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
    collection: 'aisles',
  },
);

aisleSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

aisleSchema.index({ zoneId: 1, code: 1, isDeleted: 1 }, { unique: true });
aisleSchema.index({ zoneId: 1, isDeleted: 1 });

export const AisleModel = mongoose.model<AisleDocument>('Aisle', aisleSchema);
