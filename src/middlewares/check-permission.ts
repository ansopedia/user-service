import type { NextFunction, Request, Response } from "express";

import { UserDAL } from "@/api/v1/user/user.dal.js";
import { ErrorTypeEnum, type Permission } from "@/constants";

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const { loggedInUser } = res.locals;

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
