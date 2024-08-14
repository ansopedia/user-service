import { Schema, model } from 'mongoose';
import { Permission } from './permission.validation';

const PermissionSchema = new Schema<Permission>(
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
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const PermissionModel = model<Permission>('Permission', PermissionSchema);
