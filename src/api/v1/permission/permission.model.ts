import { Model, Schema, model } from "mongoose";

import { Permission, PermissionCategory } from "./permission.validation";

const PermissionSchema: Schema<Permission> = new Schema<Permission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
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
    category: {
      type: String,
      enum: Object.values(PermissionCategory),
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const PermissionModel: Model<Permission> = model<Permission>("Permission", PermissionSchema);
