import { z } from "zod";
import { objectIdSchema } from "@/utils";

const roleSchema = z.object({
  id: objectIdSchema,
  name: z
    .string()
    .min(3, "name must be at least 3 characters")
    .max(18, "name must be at most 18 characters")
    .regex(/^[a-z][a-z-]*$/i, "name must start with a letter")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  isDeleted: z.boolean().default(false),
  isSystemRole: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: objectIdSchema,
  updatedBy: objectIdSchema,
});

export const createRoleSchema = roleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export const validateRoleName = roleSchema.pick({ name: true });

export const updateRoleSchema = roleSchema.partial({
  name: true,
  description: true,
  updatedBy: true,
});
export const getRoleSchema = roleSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
  isSystemRole: true,
});

export type Role = z.infer<typeof roleSchema>;
export type createRole = z.infer<typeof createRoleSchema>;
export type getRole = z.infer<typeof getRoleSchema>;
