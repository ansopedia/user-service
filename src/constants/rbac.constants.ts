import { Types } from "mongoose";

import { PermissionCategory, createPermission } from "@/api/v1/permission/permission.validation";
import { createRole } from "@/api/v1/role/role.validation";

import { envConstants } from "./env.constant";

// Generate a unique ObjectId for the system user, which might represent a system-level action
const systemUserObjectId: string = new Types.ObjectId().toHexString();

export interface IDefaultRolePermission {
  [key: string]: string[];
}

export const PERMISSIONS = {
  // User Management Permissions
  CREATE_USERS: "create-users",
  VIEW_USERS: "view-users",
  EDIT_USERS: "edit-users",
  DELETE_USERS: "delete-users",
  RESTORE_USERS: "restore-users",

  // Role Management Permissions
  CREATE_ROLES: "create-roles",
  VIEW_ROLES: "view-roles",
  EDIT_ROLES: "edit-roles",
  DELETE_ROLES: "delete-roles",
  RESTORE_ROLES: "restore-roles",

  // Role Permission Management Permissions
  CREATE_ROLE_PERMISSIONS: "create-role-permissions",
  VIEW_ROLE_PERMISSIONS: "view-role-permissions",
  EDIT_ROLE_PERMISSIONS: "edit-role-permissions",
  DELETE_ROLE_PERMISSIONS: "delete-role-permissions",
  RESTORE_ROLE_PERMISSIONS: "restore-role-permissions",

  // User-Role Management Permissions
  CREATE_USER_ROLES: "create-user-roles",
  VIEW_USER_ROLES: "view-user-roles",
  EDIT_USER_ROLES: "edit-user-roles",
  DELETE_USER_ROLES: "delete-user-roles",
  RESTORE_USER_ROLES: "restore-user-roles",

  // Profile
  VIEW_PROFILE: "view-profile",
  EDIT_PROFILE: "edit-profile",
  DELETE_PROFILE: "delete-profile",
} as const;

// Create a type based on the values of PERMISSIONS
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  USER: "user",
};

export const defaultPermissions: createPermission[] = [
  // User Management Permissions
  {
    name: PERMISSIONS.CREATE_USERS,
    description: "Allows the user to create new user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_USERS,
    description: "Allows the user to view user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_USERS,
    description: "Allows the user to edit user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_USERS,
    description: "Allows the user to delete user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_USERS,
    description: "Allows the user to restore user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Role Management Permissions
  {
    name: PERMISSIONS.CREATE_ROLES,
    description: "Allows the user to create new roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_ROLES,
    description: "Allows the user to view roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_ROLES,
    description: "Allows the user to edit roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_ROLES,
    description: "Allows the user to delete roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_ROLES,
    description: "Allows the user to restore roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Role Permission Management Permissions
  {
    name: PERMISSIONS.CREATE_ROLE_PERMISSIONS,
    description: "Allows the user to create new role permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_ROLE_PERMISSIONS,
    description: "Allows the user to view role permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_ROLE_PERMISSIONS,
    description: "Allows the user to edit role permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_ROLE_PERMISSIONS,
    description: "Allows the user to delete role permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_ROLE_PERMISSIONS,
    description: "Allows the user to restore role permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // User-Role Management Permissions
  {
    name: PERMISSIONS.CREATE_USER_ROLES,
    description: "Allows the user to create new user roles",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_USER_ROLES,
    description: "Allows the user to view user roles",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_USER_ROLES,
    description: "Allows the user to edit user roles",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_USER_ROLES,
    description: "Allows the user to delete user roles",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_USER_ROLES,
    description: "Allows the user to restore user roles",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Profile
  {
    name: PERMISSIONS.VIEW_PROFILE,
    description: "Allows the user to view their profile",
    category: PermissionCategory.PROFILE,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_PROFILE,
    description: "Allows the user to edit their profile",
    category: PermissionCategory.PROFILE,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_PROFILE,
    description: "Allows the user to delete their profile",
    category: PermissionCategory.PROFILE,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
];

export const defaultRoles: createRole[] = [
  {
    name: ROLES.SUPER_ADMIN,
    description: "Super Administrator with all permissions",
    isSystemRole: true,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: ROLES.ADMIN,
    description: "Administrator with limited permissions",
    isSystemRole: true,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: ROLES.USER,
    description: "Regular user with basic permissions",
    isSystemRole: true,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
];

export const defaultRolePermissions: IDefaultRolePermission = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [PERMISSIONS.CREATE_ROLES, PERMISSIONS.EDIT_ROLES, PERMISSIONS.DELETE_ROLES],
  [ROLES.USER]: [PERMISSIONS.EDIT_PROFILE, PERMISSIONS.DELETE_PROFILE],
};

export const defaultUsers = {
  username: envConstants.DEFAULT_SUPER_ADMIN_USERNAME,
  email: envConstants.DEFAULT_SUPER_ADMIN_EMAIL,
  password: envConstants.DEFAULT_SUPER_ADMIN_PASSWORD,
  confirmPassword: envConstants.DEFAULT_SUPER_ADMIN_PASSWORD,
  isEmailVerified: true,
};
