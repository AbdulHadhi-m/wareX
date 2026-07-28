import mongoose, { Schema } from 'mongoose';
import { IUser } from './auth.types';

export type UserDocument = mongoose.Document & IUser;

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['Manager', 'Worker'],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

userSchema.set('toJSON', {
  transform(_doc: Record<string, any>, ret: Record<string, any>) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
