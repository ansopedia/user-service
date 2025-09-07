import mongoose, { Document, Schema } from "mongoose";

import { type Session } from "../auth/auth.validation.js";

export interface ISession extends Document, Session {
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    deviceInfo: { type: Schema.Types.Mixed, required: true }, // Mixed type for complex object
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISession>("Session", sessionSchema);
