import mongoose, { Schema } from 'mongoose';
import { IDevice } from './device.types';

export type DeviceDocument = mongoose.Document & IDevice;

const deviceSchema = new Schema<DeviceDocument>(
  {
    deviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    ...({ model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    } }),
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    imei: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      default: undefined,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    binId: {
      type: String,
      required: true,
    },
    aisleId: {
      type: String,
      required: true,
    },
    zoneId: {
      type: String,
      required: true,
    },
    warehouseId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'],
      required: true,
    },
    condition: {
      type: String,
      enum: ['New', 'Good', 'Fair', 'Damaged'],
      required: true,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyExpiry: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
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
    collection: 'devices',
  },
);

deviceSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

deviceSchema.index({ serialNumber: 1 }, { unique: true });
deviceSchema.index({ imei: 1 }, { sparse: true, unique: true });
deviceSchema.index({ binId: 1, isDeleted: 1 });
deviceSchema.index({ aisleId: 1, isDeleted: 1 });
deviceSchema.index({ zoneId: 1, isDeleted: 1 });
deviceSchema.index({ warehouseId: 1, isDeleted: 1 });
deviceSchema.index({ status: 1, isDeleted: 1 });
deviceSchema.index({ brand: 1, isDeleted: 1 });
deviceSchema.index({ category: 1, isDeleted: 1 });
deviceSchema.index({ sku: 1 });
deviceSchema.index({ warehouseId: 1, status: 1, isDeleted: 1 });
deviceSchema.index({ deviceName: 'text', brand: 'text', model: 'text', serialNumber: 'text' });

export const DeviceModel = mongoose.model<DeviceDocument>('Device', deviceSchema);
