import type { CreatePlatformInput } from "@ansospace/types";
import {
  type CreatePermission,
  type CreateRole,
  type Email,
  type Password,
  PermissionCategory,
  type Username,
} from "@ansospace/types";
import mongoose from "mongoose";

import { envConstants } from "./env.constant.js";

// Generate a unique ObjectId for the system user, which might represent a system-level action
const systemUserObjectId = new mongoose.Types.ObjectId();

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
  ASSIGN_USER_ROLES: "assign-user-roles",
  VIEW_USER_ACCESS_CONTROL: "view-user-access-control",

  // Profile
  VIEW_PROFILE: "view-profile",
  EDIT_PROFILE: "edit-profile",
  DELETE_PROFILE: "delete-profile",

  // Course Management Permissions
  CREATE_COURSE: "create-course",
  VIEW_COURSE: "view-course",
  EDIT_COURSE: "edit-course",
  DELETE_COURSE: "delete-course",
  RESTORE_COURSE: "restore-course",
  UPDATE_COURSE: "update-course",

  // Platform Management Permissions
  CREATE_PLATFORM: "create-platform",
  VIEW_PLATFORMS: "view-platforms",
  EDIT_PLATFORM: "edit-platform",
  DELETE_PLATFORM: "delete-platform",

  // Permission Management Permissions
  VIEW_PERMISSIONS: "view-permissions",

  // Audit Management Permissions
  VIEW_AUDIT_LOGS: "view-audit-logs",
} as const;

// Create a type based on the values of PERMISSIONS
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  USER: "user",
};

export const defaultPermissions: CreatePermission[] = [
  // User Management Permissions
  {
    name: PERMISSIONS.CREATE_USERS,
    description:
      "Allows authorized users to create new user accounts, assign roles, and initialize user profiles securely within the system.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_USERS,
    description:
      "Grants the ability to view user accounts, including names, roles, and activity information for administrative review or audit.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_USERS,
    description:
      "Allows modification of user details such as personal data, assigned roles, or account settings within authorized scope.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_USERS,
    description:
      "Authorizes the permanent removal or deactivation of user accounts from the system by an admin or system manager.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_USERS,
    description:
      "Allows restoring previously deleted or deactivated user accounts, reinstating all related roles and access rights.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Role Management Permissions
  {
    name: PERMISSIONS.CREATE_ROLES,
    description:
      "Grants permission to create new roles and define sets of permissions for different types of system users.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_ROLES,
    description:
      "Allows viewing available roles in the system, including their assigned permissions and related access policies.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_ROLES,
    description:
      "Allows editing existing roles, modifying their names, permissions, or descriptions as per system requirements.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_ROLES,
    description:
      "Permits deletion or deactivation of existing roles that are no longer required in the system configuration.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_ROLES,
    description:
      "Allows restoring previously deleted or inactive roles along with their permission mappings for reuse.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Role Permission Management Permissions
  {
    name: PERMISSIONS.CREATE_ROLE_PERMISSIONS,
    description: "Allows creating new role-permission mappings to define what actions each role is allowed to perform.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_ROLE_PERMISSIONS,
    description:
      "Grants visibility into which permissions are assigned to specific roles within the system configuration.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_ROLE_PERMISSIONS,
    description:
      "Allows modifying role-permission relationships by adding or removing specific permissions from a role.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_ROLE_PERMISSIONS,
    description: "Permits deletion of role-permission associations that are outdated or no longer applicable.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_ROLE_PERMISSIONS,
    description: "Allows restoring deleted role-permission mappings to reinstate access configurations as before.",
    category: PermissionCategory.ROLE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // User Role Management Permissions
  {
    name: PERMISSIONS.CREATE_USER_ROLES,
    description:
      "Allows creating new user-role assignments, linking users to specific system roles for access control.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_USER_ROLES,
    description: "Grants visibility into which roles are assigned to specific users for audit and management purposes.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_USER_ROLES,
    description:
      "Allows authorized updates to a user's assigned roles, adjusting their permissions dynamically as needed.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_USER_ROLES,
    description: "Enables deletion of user-role associations, effectively revoking assigned permissions for that user.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_USER_ROLES,
    description: "Allows restoration of previously deleted user-role assignments, re-establishing access privileges.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.ASSIGN_USER_ROLES,
    description: "Allows assigning roles to users, establishing their access privileges within the system.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_USER_ACCESS_CONTROL,
    description: "Allows viewing the consolidated access control profile of a specific user for auditing purposes.",
    category: PermissionCategory.USER_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  // Profile Permissions
  {
    name: PERMISSIONS.VIEW_PROFILE,
    description: "Allows users to view their personal profile information including account details and preferences.",
    category: PermissionCategory.PROFILE,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_PROFILE,
    description: "Allows users to modify personal profile details such as name, password, or contact information.",
    category: PermissionCategory.PROFILE,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_PROFILE,
    description: "Grants the user permission to permanently delete their profile and associated account data.",
    category: PermissionCategory.PROFILE,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Course Permissions
  {
    name: PERMISSIONS.CREATE_COURSE,
    description:
      "Allows authorized users to create new courses, define structure, and upload related learning materials.",
    category: PermissionCategory.COURSE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_COURSE,
    description:
      "Grants access to view available courses, including details, instructors, and learning content overview.",
    category: PermissionCategory.COURSE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_COURSE,
    description: "Allows modifying the course's educational content, such as lessons, structure, and metadata.",
    category: PermissionCategory.COURSE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.UPDATE_COURSE,
    description: "Allows updating administrative course settings such as pricing, scheduling, and publication status.",
    category: PermissionCategory.COURSE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_COURSE,
    description: "Permits deletion or archiving of outdated or inactive courses from the learning management system.",
    category: PermissionCategory.COURSE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.RESTORE_COURSE,
    description: "Allows restoring previously deleted or archived courses to make them accessible again.",
    category: PermissionCategory.COURSE_MANAGEMENT,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },

  // Platform Permissions
  {
    name: PERMISSIONS.CREATE_PLATFORM,
    description: "Allows creating new platform entries, defining platform settings, and initializing configurations.",
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_PLATFORMS,
    description: "Grants visibility into all platform data including names, configurations, and operational status.",
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.EDIT_PLATFORM,
    description: "Allows editing existing platform settings and configurations for maintenance or feature updates.",
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.DELETE_PLATFORM,
    description: "Permits authorized removal or deactivation of a platform instance that is no longer in use.",
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_PERMISSIONS,
    description:
      "Allows viewing all available system permissions for audit, documentation, or configuration review purposes.",
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
  {
    name: PERMISSIONS.VIEW_AUDIT_LOGS,
    description:
      "Allows users to view audit logs of their own activities and authorized users to view logs across the system for security auditing.",
    category: PermissionCategory.SYSTEM,
    createdBy: systemUserObjectId,
    isDeleted: false,
  },
];
export const defaultRoles: CreateRole[] = [
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
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_ROLES,
    PERMISSIONS.EDIT_ROLES,
    PERMISSIONS.DELETE_ROLES,
    PERMISSIONS.CREATE_PLATFORM,
    PERMISSIONS.VIEW_PLATFORMS,
    PERMISSIONS.EDIT_PLATFORM,
    PERMISSIONS.DELETE_PLATFORM,
    PERMISSIONS.VIEW_PERMISSIONS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  [ROLES.USER]: [PERMISSIONS.EDIT_PROFILE, PERMISSIONS.DELETE_PROFILE, PERMISSIONS.VIEW_AUDIT_LOGS],
};

export const defaultUsers = {
  username: envConstants.DEFAULT_SUPER_ADMIN_USERNAME as Username,
  email: envConstants.DEFAULT_SUPER_ADMIN_EMAIL as Email,
  password: envConstants.DEFAULT_SUPER_ADMIN_PASSWORD as Password,
  confirmPassword: envConstants.DEFAULT_SUPER_ADMIN_PASSWORD as Password,
  isEmailVerified: true,
};

export const defaultPlatformData: CreatePlatformInput = {
  name: "Service Marketplace",
  slug: "smp",
  description: "Connects customers with verified service providers",
  logoUrl: "https://cdn.ansopedia.com/smp-logo.png",
  status: "active" as const,
};
