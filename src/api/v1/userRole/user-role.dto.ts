import { type UserRole } from "./user-role.validation.js";

export const UserRoleDto = (rolePermission: UserRole) => ({
  getUserRole: () => {
    return {
      userId: rolePermission.userId,
      roleId: rolePermission.roleId,
    };
  },
});
