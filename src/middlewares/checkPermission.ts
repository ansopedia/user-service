import { NextFunction, Request, Response } from 'express';
import { UserRoleService } from '../api/v1/userRole/user-role.service';
import { RolePermissionDAL } from '@/api/v1/rolePermission/role-permission.dal';
import { PermissionDAL } from '@/api/v1/permission/permission.dal';
import { ErrorTypeEnum } from '@/constants';

export const checkPermission = (requiredPermissions: string[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const loggedInUser = req.body.loggedInUser;

      // Get user roles
      const userRoles = await UserRoleService.getUserRoles(loggedInUser.userId);

      // Get role IDs
      const roleIds = userRoles.map((userRole) => userRole.roleId);

      // Get role permissions
      const rolePermissions = await RolePermissionDAL.getPermissionsByRoleIds(roleIds);

      // Get permission IDs
      const permissionIds = rolePermissions.map((rolePermission) => rolePermission.permissionId);

      // Get actual permissions
      const userPermissions = await PermissionDAL.getPermissionsByIds(permissionIds);

      // Check if user has required permissions
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.some((userPermission) => userPermission.name === permission),
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
