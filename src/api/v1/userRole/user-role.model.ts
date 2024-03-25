import mongoose, { Schema, model } from 'mongoose';
import { UserRole } from './user-role.validation';
import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';

const UserRoleSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'role',
      required: true,
    },
  },
  { timestamps: true },
);

UserRoleSchema.index({ roleId: 1, userId: 1 }, { unique: true });

UserRoleSchema.pre('save', async function (next) {
  const userExists = await mongoose.model('User').exists({ _id: this.userId });
  const roleExists = await mongoose.model('Role').exists({ _id: this.roleId });

  if (!userExists) {
    throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);
  }

  if (!roleExists) {
    throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);
  }

  next();
});

export const UserRoleModel = model<UserRole>('UserRole', UserRoleSchema);
