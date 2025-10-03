import type { RolePermission } from "@ansospace/types";

export const RolePermissionDto = ({ roleId, permissionId }: RolePermission) => ({
  getRolePermission: () => ({ roleId, permissionId }),
});
