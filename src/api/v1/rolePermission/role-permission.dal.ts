import type { RolePermission } from "@ansospace/types";

import type { CreateRolePermissionDTO } from "../role/role.dto.js";
import { RolePermissionModel } from "./role-permission.model.js";

export class RolePermissionDAL {
  /**
   * Bulk create permissions.
   * 'ordered: false' ensures if one fails (rare race condition), others still insert.
   */
  static async createMany(data: Pick<RolePermission, "roleId" | "permissionId">[]): Promise<RolePermission[]> {
    return await RolePermissionModel.insertMany(data, { ordered: false });
  }

  static async createRolePermission(rolePermissionData: RolePermission): Promise<RolePermission> {
    return RolePermissionModel.create(rolePermissionData);
  }

  /**
   * Find which permissions from the list already exist for this role.
   * Used to filter out duplicates before inserting.
   */
  static async findExisting({ roleId, permissionIds }: CreateRolePermissionDTO): Promise<RolePermission[]> {
    return await RolePermissionModel.find({
      roleId: roleId,
      permissionId: { $in: permissionIds },
    }).lean();
  }
}
