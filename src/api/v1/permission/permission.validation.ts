import { Types } from 'mongoose';
import { z } from 'zod';

const permissionSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(3, 'name must be at least 3 characters')
    .max(18, 'name must be at most 18 characters')
    .regex(/^[a-z][a-z-]*$/i, 'name must start with a letter')
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().min(25).max(255),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'createdBy must be a valid MongoDB ObjectId',
  }),
  updatedBy: z.string().uuid(),
});

export const createPermissionSchema = permissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
});

export const validatePermissionName = permissionSchema.pick({ name: true });

export const updatePermissionSchema = permissionSchema.partial({ name: true, description: true, updatedBy: true });
export const getPermissionSchema = permissionSchema.omit({ createdBy: true, updatedBy: true, isDeleted: true });

export type Permission = z.infer<typeof permissionSchema>;
export type createPermission = z.infer<typeof createPermissionSchema>;
export type getPermission = z.infer<typeof getPermissionSchema>;
