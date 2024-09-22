import { RoleDAL } from "./role.dal";
import { RoleDto } from "./role.dto";
import { createRole, createRoleSchema, getRole } from "./role.validation";
import { ErrorTypeEnum } from "@/constants";

export class RoleService {
  static async createRole(userData: createRole): Promise<getRole> {
    const validRoleData = createRoleSchema.parse(userData);

    const isRoleExist = await RoleDAL.getRoleByName(validRoleData.name);

    if (isRoleExist) throw new Error(ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS);

    const createdRole = await RoleDAL.createRole(validRoleData);

    return RoleDto(createdRole).getRole();
  }

  static async getRoles(): Promise<getRole[]> {
    const roles = await RoleDAL.getRoles();
    return roles.map((role) => RoleDto(role).getRole());
  }

  static async getRoleByName(roleName: string): Promise<getRole> {
    const role = await RoleDAL.getRoleByName(roleName);

    if (!role) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

    return RoleDto(role).getRole();
  }
}
