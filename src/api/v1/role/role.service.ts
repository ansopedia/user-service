import { ZodError } from 'zod';
import { RoleDAL } from './role.dal';
import { RoleDto } from './role.dto';
import { createRole, createRoleSchema, getRole } from './role.validation';
import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';

export class RoleService {
  static async createRole(userData: createRole): Promise<getRole | ZodError> {
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
}
