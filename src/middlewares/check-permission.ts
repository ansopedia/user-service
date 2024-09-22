import { NextFunction, Request, Response } from "express";

import { Auth } from "@/api/v1/auth/auth.validation";
import { UserDAL } from "@/api/v1/user/user.dal";
import { ErrorTypeEnum, Permission } from "@/constants";

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const { loggedInUser } = req.body as { loggedInUser: Auth };

      const userRolePermissions = await UserDAL.getUserRolesAndPermissionsByUserId(loggedInUser.userId);

      const hasPermission = requiredPermissions.every((permission) =>
        userRolePermissions.allPermissions.some((userPermission) => userPermission.name === permission)
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
