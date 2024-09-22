import { RolePermission } from "./role-permission.validation";

export const RolePermissionDto = ({ roleId, permissionId }: RolePermission) => ({
  getRolePermission: () => ({ roleId, permissionId }),
});
