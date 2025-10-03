import { type CreateRole, type GetRole, createRoleSchema } from "@ansospace/types";

import { ErrorTypeEnum } from "@/constants";

import { RoleDAL } from "./role.dal.js";
import { RoleDto } from "./role.dto.js";

export class RoleService {
  static async createRole(userData: CreateRole): Promise<GetRole> {
    const validRoleData = createRoleSchema.parse(userData);

    const isRoleExist = await RoleDAL.getRoleByName(validRoleData.name);

    if (isRoleExist) throw new Error(ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS);

    const createdRole = await RoleDAL.createRole(validRoleData);

    return RoleDto(createdRole).getRole();
  }

  static async getRoles(): Promise<GetRole[]> {
    const roles = await RoleDAL.getRoles();
    return roles.map((role) => RoleDto(role).getRole());
  }

  static async getRoleByName(roleName: string): Promise<GetRole> {
    const role = await RoleDAL.getRoleByName(roleName);

    if (!role) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

    return RoleDto(role).getRole();
  }
}
