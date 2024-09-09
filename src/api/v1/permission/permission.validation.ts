import { z } from 'zod';
import { objectIdSchema } from '@/utils';

export enum PermissionCategory {
  'USER_MANAGEMENT' = 'USER_MANAGEMENT',
  'CONTENT_MANAGEMENT' = 'CONTENT_MANAGEMENT',
  'ROLE_MANAGEMENT' = 'ROLE_MANAGEMENT',
  'ANALYTICS' = 'ANALYTICS',
  'SYSTEM' = 'SYSTEM',
  'PROFILE' = 'PROFILE',
}

const permissionSchema = z.object({
  id: objectIdSchema,
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long.')
    .max(30, 'Name must be at most 30 characters long.')
    .regex(/^[a-z][a-z-]*$/i, 'Name must start with a letter and can only contain letters and hyphens.')
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  category: z.nativeEnum(PermissionCategory),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: objectIdSchema,
  updatedBy: objectIdSchema,
});

export const createPermissionSchema = permissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export const validatePermissionName = permissionSchema.pick({ name: true });

export const getPermissionSchema = permissionSchema.omit({ createdBy: true, updatedBy: true, isDeleted: true });

export type Permission = z.infer<typeof permissionSchema>;
export type createPermission = z.infer<typeof createPermissionSchema>;
export type getPermission = z.infer<typeof getPermissionSchema>;
