import type { Role } from "@ansospace/types";
import { Model, Schema, model } from "mongoose";

const RoleSchema: Schema<Role> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 18,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 25,
      maxlength: 255,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const RoleModel: Model<Role> = model<Role>("Role", RoleSchema);
