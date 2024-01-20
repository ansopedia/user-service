import mongoose, { Document, Schema } from 'mongoose';
import { IOAuthProvider, oAuthProviderSchema } from './AuthProvider';

// User Schema
export interface IUser extends Document {
  // Core User Information
  name: string;
  username?: string;
  email: string;
  password: string;
  mobile?: string;

  // Points and Notifications
  points: { totalCoins: number };
  notifications: Schema.Types.ObjectId[];

  // Additional Information
  designation?: string;
  roles: Schema.Types.ObjectId[];
  avatar?: string;

  // Verification and Security
  isAccountVerified?: boolean;
  isProfileComplete: boolean;
  tokens: { [key: string]: unknown }[];
  otp?: { [key: string]: unknown };

  // OAuth Providers
  oauthProviders?: IOAuthProvider[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    // Core User Information
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      // unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    mobile: {
      type: String,
      trim: true,
    },

    // Points and Notifications
    points: {
      totalCoins: { type: Number, default: 100 },
    },
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'notifications',
      },
    ],

    // Additional Information
    designation: {
      type: String,
      trim: true,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'roles',
      },
    ],
    avatar: { type: String },

    // Verification and Security
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    tokens: [{ type: Schema.Types.Mixed }],
    otp: { type: Schema.Types.Mixed },

    // OAuth Providers
    oauthProviders: [oAuthProviderSchema],
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>('users', userSchema);
