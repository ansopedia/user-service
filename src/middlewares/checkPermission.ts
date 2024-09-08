import { NextFunction, Request, Response } from 'express';
import { ErrorTypeEnum, Permission } from '@/constants';
import { UserDAL } from '@/api/v1/user/user.dal';
import { Auth } from '@/api/v1/auth/auth.validation';

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const loggedInUser: Auth = req.body.loggedInUser;

      const userRolePermissions = await UserDAL.getUserRolesAndPermissionsByUserId(loggedInUser.userId);

      const hasPermission = requiredPermissions.every((permission) =>
        userRolePermissions.allPermissions.some((userPermission) => userPermission.name === permission),
      );

      if (!hasPermission) {
        throw new Error(ErrorTypeEnum.enum.NOT_ENOUGH_PERMISSION);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
