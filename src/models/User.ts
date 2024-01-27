import mongoose, { Document, Schema } from 'mongoose';

// User Schema
export interface IUser extends Document {
  // Core User Information
  name: string;
  username?: string;
  email: string;
  password: string;
  mobile?: string;

  // Points and Notifications
  points: { totalPoints: number };

  // Additional Information
  role: string;
  avatar?: string;

  // Verification and Security
  isAccountVerified?: boolean;
  isAccountDisabled?: boolean;
  isProfileComplete: boolean;
  tokens: { accessToken: string }[];
  otp?: { [key: string]: unknown };
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

    // Additional Information
    role: {
      type: String,
      default: 'user',
    },
    avatar: { type: String },

    // Verification and Security
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    isAccountDisabled: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        type: {
          accessToken: { type: String },
        },
      },
    ],
    otp: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>('users', userSchema);
