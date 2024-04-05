import { Schema, model } from 'mongoose';
import { Auth } from './auth.validation';

const AuthSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const AuthModel = model<Auth>('Auth', AuthSchema);
