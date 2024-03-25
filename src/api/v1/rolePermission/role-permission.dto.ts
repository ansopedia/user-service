import { RolePermission } from './role-permission.validation';

export const RolePermissionDto = (rolePermission: RolePermission) => ({
  getRolePermission: () => {
    return {
      roleId: rolePermission.roleId,
      permissionId: rolePermission.permissionId,
    };
  },
});
