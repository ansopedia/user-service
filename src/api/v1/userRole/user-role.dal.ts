import { UserRoleModel } from './user-role.model';
import { UserRole } from './user-role.validation';

export class UserRoleDAL {
  static async createUserRole(userRole: UserRole) {
    const rolePermission = await UserRoleModel.create(userRole);
    return rolePermission.save();
  }

  static async exists(userRole: UserRole) {
    return UserRoleModel.exists(userRole);
  }
}
