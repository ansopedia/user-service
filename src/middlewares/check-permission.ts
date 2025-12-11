import type { UserAccessControlProfile } from "@ansospace/types";
import type { NextFunction, Request, Response } from "express";

import { UserDAL } from "@/api/v1/user/user.dal.js";
import { ErrorTypeEnum, type Permission } from "@/constants";

const permissionExistsInProfile = (permission: Permission, accessProfile: UserAccessControlProfile): boolean => {
  return accessProfile.permissions.some((perm) => perm === permission);
};

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const { loggedInUser } = res.locals;

      const accessProfile = await UserDAL.getAccessControlProfile(loggedInUser.userId);

      const hasPermission = requiredPermissions.every((permission) =>
        permissionExistsInProfile(permission, accessProfile)
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
