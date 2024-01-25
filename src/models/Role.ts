import mongoose, { Document, Schema } from 'mongoose';

// Role Schema
export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: Schema.Types.ObjectId[];
  isDefault: boolean;
  isProtected: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
  lastUpdatedBy: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Schema.Types.ObjectId;
  // Metadata for organization and search
  keywords: string[];

  // Track role assignments
  assignedUsers: Schema.Types.ObjectId[];

  // Versioning for tracking changes
  version: object;
}

const roleSchema: Schema<IRole> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    version: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    keywords: {
      type: [String],
      default: [],
    },
    assignedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

// Add indexes for optimized queries
roleSchema.index({
  name: 'text',
  permissions: 1,
  isDefault: 1,
  isProtected: 1,
  isDeleted: 1,
});
roleSchema.index({ keywords: 1 });
roleSchema.index({ assignedUsers: 1 });

export const RoleModel = mongoose.model<IRole>('roles', roleSchema);
