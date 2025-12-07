import type { ObjectId, UserRole } from "@ansospace/types";

import type { AssignUserRoleDTO } from "../user/user.dto.js";
import { UserRoleModel } from "./user-role.model.js";

export class UserRoleDAL {
  static async assignRoleToUser(userRole: Pick<UserRole, "roleId" | "userId">) {
    return await UserRoleModel.create(userRole);
  }

  /**
   * Find which roles from the list already exist for this user.
   * Used to filter out duplicates before inserting.
   */
  static async findExistingRolesForUser({ userId, roleIds }: AssignUserRoleDTO): Promise<UserRole[]> {
    return await UserRoleModel.find({
      userId: userId,
      roleIds: { $in: roleIds },
    }).lean();
  }

  /**
   * Bulk create permissions.
   * 'ordered: false' ensures if one fails (rare race condition), others still insert.
   */
  static async assignRolesToUser(data: Pick<UserRole, "roleId" | "userId">[]) {
    return await UserRoleModel.insertMany(data, { ordered: false });
  }

  static async getUserRoles(userId: ObjectId) {
    return await UserRoleModel.find({ userId });
  }

  static async exists(userRole: UserRole) {
    return await UserRoleModel.exists(userRole);
  }
}
