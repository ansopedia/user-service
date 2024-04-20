import { model, Schema } from 'mongoose';
import { PublicProfileSchema } from '../../../types';

const ProfileSchema = new Schema<PublicProfileSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    dob: {
      type: Date,
    },
    fullName: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    pronouns: {
      type: String,
      trim: true,
      enum: ['he/him', 'she/her', 'they/them', 'other'],
    },
  },
  { timestamps: true },
);

export const ProfileModel = model<PublicProfileSchema>('Profile', ProfileSchema);
