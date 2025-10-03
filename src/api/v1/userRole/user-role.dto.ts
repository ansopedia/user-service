import type { UserRole } from "@ansospace/types";

export const UserRoleDto = (rolePermission: UserRole) => ({
  getUserRole: () => {
    return {
      userId: rolePermission.userId,
      roleId: rolePermission.roleId,
    };
  },
});
