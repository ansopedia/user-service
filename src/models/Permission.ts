import mongoose, { Document, Schema } from 'mongoose';

// Permission Schema
export interface IPermission extends Document {
  // Core Information
  name: string;
  description?: string;
  type: string; // e.g., 'resource', 'action'
  resource?: string; // Optional resource for resource-based permissions
  actions?: string[]; // Optional actions for action-based permissions
  isProtected: boolean; // Prevent accidental deletion of essential permissions

  // Tracking and Metadata
  createdBy: Schema.Types.ObjectId; // Track permission creation
  lastUpdatedBy: Schema.Types.ObjectId; // Track permission modification
  createdAt: Date;
  updatedAt: Date;

  // Versioning and Soft Deletion
  version: number; // Track changes
  isDeleted: boolean; // Soft deletion
  deletedAt?: Date; // Date of deletion
  deletedBy?: Schema.Types.ObjectId; // User who performed the deletion
}

const permissionSchema: Schema<IPermission> = new Schema(
  {
    // Core Information
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['resource', 'action'],
    },
    resource: {
      type: String,
    },
    actions: [
      {
        type: String,
      },
    ],
    isProtected: {
      type: Boolean,
      default: false,
    },

    // Tracking and Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: Date,
    updatedAt: Date,

    // Versioning and Soft Deletion
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
  },
  {
    timestamps: true,
  },
);

// Add indexes for optimized queries
permissionSchema.index({ name: 1, isDeleted: 1 });

export const PermissionModel = mongoose.model<IPermission>('permissions', permissionSchema);
