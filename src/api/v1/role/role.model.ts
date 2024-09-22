import { Schema, model, Model, Types } from "mongoose";
import { Role } from "./role.validation";

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
    createdBy: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: "createdBy must be a valid MongoDB ObjectId string",
      },
      ref: "User",
    },
    updatedBy: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: "updatedBy must be a valid MongoDB ObjectId string",
      },
      ref: "User",
    },
  },
  { timestamps: true }
);

export const RoleModel: Model<Role> = model<Role>("Role", RoleSchema);
