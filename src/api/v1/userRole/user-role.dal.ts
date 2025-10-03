import type { MongooseObjectId, UserRole } from "@ansospace/types";

import { UserRoleModel } from "./user-role.model.js";

export class UserRoleDAL {
  static async createUserRole(userRole: UserRole) {
    const userRolePermission = await UserRoleModel.create(userRole);
    return userRolePermission.save();
  }

  static async getUserRoles(userId: MongooseObjectId) {
    return await UserRoleModel.find({ userId });
  }

  static async exists(userRole: UserRole) {
    return await UserRoleModel.exists(userRole);
  }
}
