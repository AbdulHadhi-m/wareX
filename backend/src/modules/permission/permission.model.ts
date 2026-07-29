import mongoose, { Schema } from 'mongoose';
import { IPermission } from './permission.types';

export type PermissionDocument = mongoose.Document & IPermission;

const permissionSchema = new Schema<PermissionDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'permissions',
  },
);

permissionSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const PermissionModel = mongoose.model<PermissionDocument>('Permission', permissionSchema);
