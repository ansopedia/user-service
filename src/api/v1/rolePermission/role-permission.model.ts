import mongoose, { Schema, model } from 'mongoose';
import { RolePermission } from './role-permission.validation';
import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';

const RolePermissionSchema = new Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'role',
      required: true,
    },
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'permission',
      required: true,
    },
  },
  { timestamps: true },
);

RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

RolePermissionSchema.pre('save', async function (next) {
  const roleExists = await mongoose.model('Role').exists({ _id: this.roleId });
  const permissionExists = await mongoose.model('Permission').exists({ _id: { $in: this.permissionId } });

  if (!roleExists) {
    throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);
  }

  if (!permissionExists) {
    throw new Error(ErrorTypeEnum.enum.PERMISSION_NOT_FOUND);
  }

  next();
});

export const RolePermissionModel = model<RolePermission>('RolePermission', RolePermissionSchema);
