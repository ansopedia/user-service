import { Schema, model } from "mongoose";

import type { Auth } from "./auth.validation.js";

const AuthSchema = new Schema<Auth>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
