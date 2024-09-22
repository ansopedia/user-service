import { UserRole } from "./user-role.validation";

export const UserRoleDto = (rolePermission: UserRole) => ({
  getUserRole: () => {
    return {
      userId: rolePermission.userId,
      roleId: rolePermission.roleId,
    };
  },
});
