import { type GetPermission, type ObjectId } from "@ansospace/types";

import { PermissionDAL } from "./permission.dal.js";
import { PermissionDto } from "./permission.dto.js";

export class PermissionService {
  static async getPermissions(): Promise<GetPermission[]> {
    const permissions = await PermissionDAL.getPermissions();
    return permissions.map((permission) => PermissionDto(permission).getPermission());
  }

  static async getPermissionsByUserId(userId: ObjectId): Promise<GetPermission[]> {
    const permissions = await PermissionDAL.getPermissionsByUserId(userId);
    return permissions.map((permission) => PermissionDto(permission).getPermission());
  }
}
