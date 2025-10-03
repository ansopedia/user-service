import type { GetPermission, Permission } from "@ansospace/types";

export const PermissionDto = (permission: Permission) => ({
  getPermission: (): GetPermission => ({
    id: permission.id,
    name: permission.name,
    description: permission.description,
    category: permission.category,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  }),
});
