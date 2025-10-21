import type { Platform } from "@ansospace/types";
import mongoose, { Document, Model, Schema, model } from "mongoose";

export interface IPlatform extends Document, Platform {
  id: mongoose.Types.ObjectId;
}

const PlatformSchema: Schema<IPlatform> = new Schema<IPlatform>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Add index on slug for performance
PlatformSchema.index({ slug: 1 });

// Pre-save middleware to trim and lowercase slug
PlatformSchema.pre("save", function (next) {
  if (this.slug) {
    this.slug = this.slug.trim().toLowerCase();
  }
  next();
});

export const PlatformModel: Model<IPlatform> = model<IPlatform>("Platform", PlatformSchema);
