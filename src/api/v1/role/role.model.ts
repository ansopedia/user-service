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
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const RoleModel: Model<IRole> = model<IRole>('Role', RoleSchema);
