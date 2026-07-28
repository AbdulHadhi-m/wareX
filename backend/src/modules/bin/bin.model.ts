import mongoose, { Schema } from 'mongoose';
import { IBin } from './bin.types';

export type BinDocument = mongoose.Document & IBin;

const binSchema = new Schema<BinDocument>(
  {
    aisleId: {
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
    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (v: number) => Number.isInteger(v) && v > 0,
        message: 'Capacity must be a positive integer',
      },
    },
    status: {
      type: String,
      enum: ['Available', 'Full', 'Blocked', 'Inactive'],
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
    collection: 'bins',
  },
);

binSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

binSchema.index({ aisleId: 1, code: 1, isDeleted: 1 }, { unique: true });
binSchema.index({ aisleId: 1, isDeleted: 1 });

export const BinModel = mongoose.model<BinDocument>('Bin', binSchema);
