import type { ObjectId } from "@ansospace/types";
import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  userId: ObjectId;
  action: string;
  sessionId?: ObjectId;
  ip?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session" },
    ip: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
