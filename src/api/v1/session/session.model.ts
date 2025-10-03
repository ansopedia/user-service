import type { Session } from "@ansospace/types";
import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document, Session {
  id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    deviceId: { type: String, required: true },
    deviceInfo: { type: Schema.Types.Mixed, required: true }, // Mixed type for complex object
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1 });

export default mongoose.model<ISession>("Session", sessionSchema);
