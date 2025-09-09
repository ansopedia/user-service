import type { RolePermission } from "./role-permission.validation.js";

export const RolePermissionDto = ({ roleId, permissionId }: RolePermission) => ({
  getRolePermission: () => ({ roleId, permissionId }),
});
