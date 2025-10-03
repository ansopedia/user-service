import type { Token } from "@ansospace/types";
import { Model, Schema, model } from "mongoose";

import { UserActionType } from "@/constants";

const TokenSchema: Schema<Token> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: Object.values(UserActionType),
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    requestAttempts: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

TokenSchema.index({ userId: 1, action: 1 }, { unique: true });
export const TokenModel: Model<Token> = model<Token>("Token", TokenSchema);
