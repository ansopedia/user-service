import { z } from "zod";

import { mongooseObjectId } from "@/types";

export const userRoleSchema = z.object({
  userId: mongooseObjectId,
  roleId: mongooseObjectId,
});

export type UserRole = z.infer<typeof userRoleSchema>;
