import mongoose, { Schema } from 'mongoose';
import { IWarehouse } from './warehouse.types';

export type WarehouseDocument = mongoose.Document & IWarehouse;

const warehouseSchema = new Schema<WarehouseDocument>(
  {
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
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: 20,
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
    collection: 'warehouses',
  },
);

warehouseSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

warehouseSchema.index({ isDeleted: 1, code: 1 }, { unique: true });
warehouseSchema.index({ isDeleted: 1, status: 1 });

export const WarehouseModel = mongoose.model<WarehouseDocument>('Warehouse', warehouseSchema);
