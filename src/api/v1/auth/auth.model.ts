import { Schema, Types, model } from "mongoose";

import { Auth } from "./auth.validation";

const AuthSchema = new Schema<Auth>(
  {
    userId: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: "userId must be a valid MongoDB ObjectId string",
      },
      ref: "User",
    },
    refreshToken: {
      type: String,
      required: true,
    },
    device: {
      type: String, // e.g., 'iPhone 14', 'Chrome on Mac', or custom fingerprint
      required: false,
    },
    ip: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

AuthSchema.index({ userId: 1, refreshToken: 1 }, { unique: true });

export const AuthModel = model<Auth>("Auth", AuthSchema);
