import { model, Schema, Types } from 'mongoose';
import { ProfileData } from './profile.validation';

const ProfileData = new Schema<ProfileData>(
  {
    userId: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: 'userId must be a valid MongoDB ObjectId string',
      },
      ref: 'User',
    },
    avatar: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    address: {
      type: {
        street: { type: String },
        city: { type: String },
        country: { type: String },
        zipCode: { type: String },
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    socialLinks: {
      type: {
        twitter: { type: String },
        linkedin: { type: String },
        github: { type: String },
      },
    },
  },
  { timestamps: true },
);

export const ProfileDataModel = model<ProfileData>('Profile', ProfileData);
