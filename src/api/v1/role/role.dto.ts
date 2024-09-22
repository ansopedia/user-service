import { getRole, Role } from "./role.validation";

export const RoleDto = (role: Role) => ({
  getRole: (): getRole => {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  },
});
