import { Schema, model } from 'mongoose';
import { UserRole } from './user-role.validation';
import { ErrorTypeEnum } from '@/constants';

const UserRoleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  { timestamps: true },
);

UserRoleSchema.index({ roleId: 1, userId: 1 }, { unique: true });

UserRoleSchema.pre('save', async function (next) {
  const userExists = await model('User').exists({ _id: this.userId });
  const roleExists = await model('Role').exists({ _id: this.roleId });

  if (!userExists) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

  if (!roleExists) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

  next();
});

export const UserRoleModel = model<UserRole>('UserRole', UserRoleSchema);
