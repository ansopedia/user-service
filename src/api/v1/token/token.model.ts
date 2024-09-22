import { model, Model, Schema, Types } from "mongoose";
import { Token, TokenAction } from "./token.validation";

const TokenSchema: Schema<Token> = new Schema(
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
    action: {
      type: String,
      enum: Object.values(TokenAction),
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

export const TokenModel: Model<Token> = model<Token>("Token", TokenSchema);
