import { Types } from 'mongoose';
import { z } from 'zod';

export const rolePermissionSchema = z.object({
  roleId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'roleId must be a valid MongoDB ObjectId',
  }),
  permissionId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'permissionId must be a valid MongoDB ObjectId',
  }),
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;
