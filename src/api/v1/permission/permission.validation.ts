import { z } from "zod";

import { mongooseObjectId } from "@/types";

export const PermissionCategory = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  CONTENT_MANAGEMENT: "CONTENT_MANAGEMENT",
  ROLE_MANAGEMENT: "ROLE_MANAGEMENT",
  ANALYTICS: "ANALYTICS",
  SYSTEM: "SYSTEM",
  PROFILE: "PROFILE",
  COURSE_MANAGEMENT: "COURSE_MANAGEMENT",
} as const;

const permissionSchema = z.object({
  id: mongooseObjectId,
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(30, "Name must be at most 30 characters long.")
    .regex(/^[a-z][a-z-]*$/i, "Name must start with a letter and can only contain letters and hyphens.")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  category: z.nativeEnum(PermissionCategory),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: mongooseObjectId,
  updatedBy: mongooseObjectId,
});

export const createPermissionSchema = permissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export const validatePermissionName = permissionSchema.pick({ name: true });

export const getPermissionSchema = permissionSchema.omit({
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
});

export type Permission = z.infer<typeof permissionSchema>;
export type CreatePermission = z.infer<typeof createPermissionSchema>;
export type GetPermission = z.infer<typeof getPermissionSchema>;
