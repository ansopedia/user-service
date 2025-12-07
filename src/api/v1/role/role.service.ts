import { type CreateRole, type GetRole, type RolePermission } from "@ansospace/types";

import { ErrorTypeEnum } from "@/constants";

import { RolePermissionDAL } from "../rolePermission/role-permission.dal.js";
import { RoleDAL } from "./role.dal.js";
import { type CreateRolePermissionDTO, RoleDto } from "./role.dto.js";

export interface IRoleService {
  createRole(userData: CreateRole): Promise<GetRole>;
  getRoles(): Promise<GetRole[]>;
  getRoleByName(roleName: string): Promise<GetRole>;
  createRolePermission(createRolePermissionDTO: CreateRolePermissionDTO): Promise<RolePermission[]>;
}

export class RoleService implements IRoleService {
  public async createRole(userData: CreateRole): Promise<GetRole> {
    const isRoleExist = await RoleDAL.getRoleByName(userData.name);

    if (isRoleExist) throw new Error(ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS);

    const createdRole = await RoleDAL.createRole(userData);

    return RoleDto(createdRole).getRole();
  }

  public async getRoles(): Promise<GetRole[]> {
    const roles = await RoleDAL.getRoles();

    return roles.map((role) => RoleDto(role).getRole());
  }

  async getRoleByName(roleName: string): Promise<GetRole> {
    const role = await RoleDAL.getRoleByName(roleName);

    if (!role) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

    return RoleDto(role).getRole();
  }

  async createRolePermission({ roleId, permissionIds }: CreateRolePermissionDTO): Promise<RolePermission[]> {
    // 1. Find which of these permissions already exist for this Role
    const existingPermissions = await RolePermissionDAL.findExisting({ roleId, permissionIds });

    // Create a Set of existing Permission IDs (strings) for fast lookup
    const existingIds = new Set(existingPermissions.map((rp) => rp.permissionId.toString()));

    // 2. Filter out the ones that already exist
    const newPermissionsToCreate = permissionIds
      .filter((permId) => !existingIds.has(permId.toString()))
      .map((permId) => ({
        roleId,
        permissionId: permId,
      }));

    // 3. If everything already exists, throw an error based on preference
    if (newPermissionsToCreate.length === 0) {
      throw new Error(ErrorTypeEnum.enum.ROLE_PERMISSION_ALREADY_EXISTS);
    }

    // 4. Bulk Create the new ones
    // Note: Cast to 'any' or Partial<RolePermission> may be needed depending on your strict types
    return await RolePermissionDAL.createMany(newPermissionsToCreate);
  }
}
