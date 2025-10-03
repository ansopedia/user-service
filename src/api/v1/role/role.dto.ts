import type { GetRole, Role } from "@ansospace/types";

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
