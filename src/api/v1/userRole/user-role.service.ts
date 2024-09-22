import { ErrorTypeEnum } from "@/constants";
import { validateObjectId } from "@/utils";

import { UserRoleDAL } from "./user-role.dal";
import { UserRoleDto } from "./user-role.dto";
import { UserRole, userRoleSchema } from "./user-role.validation";

export class UserRoleService {
  static async createUserRole(userRole: UserRole) {
    const validUserRole = userRoleSchema.parse(userRole);

    const isUserRoleExist = await UserRoleDAL.exists(validUserRole);

    if (isUserRoleExist) throw new Error(ErrorTypeEnum.enum.USER_ROLE_ALREADY_EXISTS);

    const newUserRole = await UserRoleDAL.createUserRole(validUserRole);

    return UserRoleDto(newUserRole).getUserRole();
  }

  static async getUserRoles(userId: string) {
    validateObjectId(userId);
    const userRoles = await UserRoleDAL.getUserRoles(userId);
    return userRoles.map((role) => UserRoleDto(role).getUserRole());
  }
}
