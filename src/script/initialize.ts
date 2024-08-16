import { PermissionService } from '../api/v1/permission/permission.service';
import { RoleService } from '../api/v1/role/role.service';
import { RolePermissionService } from '../api/v1/rolePermission/role-permission.service';
import { defaultPermissions, defaultRolePermissions, defaultRoles } from '../constants/rbac.constants';
import { logger } from '../utils';

export async function setupInitialRolesAndPermissions() {
  // Create permissions
  await Promise.all(
    defaultPermissions.map(async (permission) => {
      try {
        await PermissionService.createPermission(permission);
      } catch (error) {
        logger.error(`Permission already exists: permissionName = ${permission.name}, error = ${error}`);
      }
    }),
  );

  // Create roles
  await Promise.all(
    defaultRoles.map(async (role) => {
      try {
        await RoleService.createRole(role);
      } catch (error) {
        logger.error(`Role already exists: roleName = ${role.name}, error = ${error}`);
      }
    }),
  );

  const [permissions, roles] = await Promise.all([PermissionService.getPermissions(), RoleService.getRoles()]);

  //   Assign permissions to roles
  Object.keys(defaultRolePermissions).forEach(async (roleName) => {
    const role = roles.find((role) => role.name === roleName);

    if (!role) {
      logger.error(`Role not found for: roleName =  ${roleName}`);
      return;
    }

    defaultRolePermissions[roleName].forEach(async (defaultRolePermission) => {
      const permission = permissions.find((permission) => permission.name === defaultRolePermission);

      if (!permission) {
        logger.warn(`Permission not found for: defaultRolePermission =  ${defaultRolePermission}`);
        return;
      }

      try {
        await RolePermissionService.createRolePermission({ roleId: role.id, permissionId: permission.id });
      } catch (error) {
        logger.error(
          `Role permission already exists: roleName =  ${roleName}, permissionName = ${defaultRolePermission}, error = ${error}`,
        );
      }
    });
  });
}
