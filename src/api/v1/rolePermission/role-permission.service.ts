import { ErrorTypeEnum } from "@/constants";

import { RolePermissionDAL } from "./role-permission.dal";
import { RolePermissionDto } from "./role-permission.dto";
import { RolePermission, rolePermissionSchema } from "./role-permission.validation";

export class RolePermissionService {
  static async createRolePermission(createRolePermission: RolePermission) {
    const validRolePermissionData = rolePermissionSchema.parse(createRolePermission);

    const rolePermissionExists = await RolePermissionDAL.exists(validRolePermissionData);

    if (rolePermissionExists) throw new Error(ErrorTypeEnum.enum.ROLE_PERMISSION_ALREADY_EXISTS);

    const createdPermission = await RolePermissionDAL.createRolePermission(validRolePermissionData);
    return RolePermissionDto(createdPermission).getRolePermission();
  }
}
