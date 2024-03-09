import { Schema, model } from 'mongoose';
import { user } from './user.validation';

const UserSchema = new Schema<user>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 18,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
  },
  { timestamps: true },
);

export const UserModel = model<user>('User', UserSchema);
