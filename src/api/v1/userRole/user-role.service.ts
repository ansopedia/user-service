import type { ObjectId } from "@ansospace/types";

import { UserRoleDAL } from "./user-role.dal.js";
import { UserRoleDto } from "./user-role.dto.js";

export class UserRoleService {
  static async getUserRoles(userId: ObjectId) {
    const userRoles = await UserRoleDAL.getUserRoles(userId);
    return userRoles.map((role) => UserRoleDto(role).getUserRole());
  }
}
