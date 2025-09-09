import { Schema, model } from "mongoose";

import type { ProfileData } from "./profile.validation.js";

const ProfileSchema = new Schema<ProfileData>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      trim: true,
    },
    givenName: {
      type: String,
      trim: true,
    },
    familyName: {
      type: String,
      trim: true,
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
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ProfileDataModel = model<ProfileData>("Profile", ProfileSchema);
