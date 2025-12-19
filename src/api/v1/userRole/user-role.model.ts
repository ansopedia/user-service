import type { UserRole } from "@ansospace/types";
import { Schema, model } from "mongoose";

const UserRoleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

UserRoleSchema.index({ roleId: 1, userId: 1 }, { unique: true });

export const UserRoleModel = model<UserRole>("UserRole", UserRoleSchema);
