import { ErrorTypeEnum } from "@/constants";

import { PermissionDAL } from "./permission.dal.js";
import { PermissionDto } from "./permission.dto.js";
import { type CreatePermission, type GetPermission, createPermissionSchema } from "./permission.validation.js";

export class PermissionService {
  static async createPermission(createPermission: CreatePermission): Promise<GetPermission> {
    const validPermissionData = createPermissionSchema.parse(createPermission);

    const isPermissionExist = await PermissionDAL.getPermissionByName(validPermissionData.name);

    if (isPermissionExist) throw new Error(ErrorTypeEnum.enum.PERMISSION_ALREADY_EXISTS);

    const createdPermission = await PermissionDAL.createPermission(validPermissionData);

    return PermissionDto(createdPermission).getPermission();
  }

  static async getPermissions(): Promise<GetPermission[]> {
    const permissions = await PermissionDAL.getPermissions();
    return permissions.map((permission) => PermissionDto(permission).getPermission());
  }
}
