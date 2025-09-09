import { z } from "zod";

import { mongooseObjectId } from "@/types";

export const rolePermissionSchema = z.object({
  roleId: mongooseObjectId,
  permissionId: mongooseObjectId,
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;
