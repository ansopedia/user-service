import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';
import { UserRoleDAL } from './user-role.dal';
import { UserRoleDto } from './user-role.dto';
import { UserRole, userRoleSchema } from './user-role.validation';

export class UserRoleService {
  static async createUserRole(createRolePermission: UserRole) {
    const validRolePermissionData = userRoleSchema.parse(createRolePermission);

    const rolePermissionExists = await UserRoleDAL.exists(validRolePermissionData);

    if (rolePermissionExists) {
      throw new Error(ErrorTypeEnum.enum.USER_ROLE_ALREADY_EXISTS);
    }
    const createdPermission = await UserRoleDAL.createUserRole(validRolePermissionData);
    return UserRoleDto(createdPermission).getUserRole();
  }
}
