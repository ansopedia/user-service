import type { MongooseObjectId, UserRole } from "@ansospace/types";

import { ErrorTypeEnum } from "@/constants";

import { UserRoleDAL } from "./user-role.dal.js";
import { UserRoleDto } from "./user-role.dto.js";

export class UserRoleService {
  static async createUserRole(userRole: UserRole) {
    const isUserRoleExist = await UserRoleDAL.exists(userRole);

    if (isUserRoleExist) throw new Error(ErrorTypeEnum.enum.USER_ROLE_ALREADY_EXISTS);

    const newUserRole = await UserRoleDAL.createUserRole(userRole);

    return UserRoleDto(newUserRole).getUserRole();
  }

  static async getUserRoles(userId: MongooseObjectId) {
    const userRoles = await UserRoleDAL.getUserRoles(userId);
    return userRoles.map((role) => UserRoleDto(role).getUserRole());
  }
}
