import { Permission, getPermission } from './permission.validation';

export const PermissionDto = (permission: Permission) => ({
  getPermission: (): getPermission => ({
    id: permission.id,
    name: permission.name,
    description: permission.description,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  }),
});
