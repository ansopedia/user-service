import { NextFunction, Request, Response } from 'express';
import { ErrorTypeEnum } from '@/constants';
import { UserDAL } from '../api/v1/user/user.dal';

export const checkPermission = (requiredPermissions: string[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const loggedInUser = req.body.loggedInUser;

      const userRolePermissions = await UserDAL.getUserRolesAndPermissionsByUserId(loggedInUser.userId);

      const hasPermission = requiredPermissions.every((permission) =>
        userRolePermissions.allPermissions.some((userPermission) => userPermission.name === permission),
      );

      if (hasPermission) {
        next();
      } else {
        throw new Error(ErrorTypeEnum.enum.FORBIDDEN);
      }
    } catch (error) {
      next(error);
    }
  };
};
