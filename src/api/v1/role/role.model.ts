import { Schema, model, Model, Document } from 'mongoose';
import { Role } from './role.validation';

interface IRole extends Role, Document {
  id: string;
}

const RoleSchema: Schema<IRole> = new Schema(
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
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
  },
  { timestamps: true },
);

export const RoleModel: Model<IRole> = model<IRole>('Role', RoleSchema);
