import mongoose, { Schema, model } from 'mongoose';
import { Role } from './role.validation';

const RoleSchema = new Schema<Role>(
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
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const RoleModel = model<Role>('Role', RoleSchema);
