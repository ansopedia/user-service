import type { GetRole, ObjectId, Role } from "@ansospace/types";

export const RoleDto = (role: Role) => ({
  getRole: (): GetRole => {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  },
});

export type CreateRolePermissionDTO = {
  roleId: ObjectId; // or ObjectId depending on your setup
  permissionIds: ObjectId[];
};
