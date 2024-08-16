import { Types } from 'mongoose';
import { createPermission, PermissionCategory } from '../api/v1/permission/permission.validation';
import { createRole } from '../api/v1/role/role.validation';
import { CreateUser } from '../api/v1/user/user.validation';
import { envConstants } from './env.constant';

// Generate a unique ObjectId for the system user, which might represent a system-level action
const systemUserObjectId: string = new Types.ObjectId().toHexString();

export interface IDefaultRolePermission {
  [key: string]: string[];
}

export const PERMISSIONS = {
  MANAGE_PERMISSIONS: 'manage-permissions',
  MANAGE_ROLES: 'manage-roles',
  MANAGE_USERS: 'manage-users',
  MANAGE_CONTENT: 'manage-content',
  VIEW_ANALYTICS: 'view-analytics',
};

export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  USER: 'user',
};

export const defaultPermissions: createPermission[] = [
  {
    name: PERMISSIONS.MANAGE_PERMISSIONS,
    description: 'Allows the user to manage permissions',
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.MANAGE_ROLES,
    description: 'Allows the user to manage roles within the system',
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.MANAGE_USERS,
    description: 'Allows the user to manage user accounts',
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.MANAGE_CONTENT,
    description: 'Allows the user to manage content within the system',
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_ANALYTICS,
    description: 'Allows the user to view and analyze system analytics',
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
];

export const defaultRoles: createRole[] = [
  {
    name: ROLES.SUPER_ADMIN,
    description: 'Super Administrator with all permissions',
    isSystemRole: true,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: ROLES.ADMIN,
    description: 'Administrator with limited permissions',
    isSystemRole: true,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: ROLES.USER,
    description: 'Regular user with basic permissions',
    isSystemRole: true,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
];

export const defaultRolePermissions: IDefaultRolePermission = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [PERMISSIONS.MANAGE_ROLES, PERMISSIONS.MANAGE_USERS, PERMISSIONS.MANAGE_CONTENT],
  [ROLES.USER]: [PERMISSIONS.MANAGE_CONTENT],
};

export const defaultUsers: CreateUser = {
  username: envConstants.DEFAULT_SUPER_ADMIN_USERNAME,
  email: envConstants.DEFAULT_SUPER_ADMIN_EMAIL,
  password: envConstants.DEFAULT_SUPER_ADMIN_PASSWORD,
  confirmPassword: envConstants.DEFAULT_SUPER_ADMIN_PASSWORD,
  isDeleted: false,
  isEmailVerified: true,
};
