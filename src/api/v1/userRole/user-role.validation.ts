import mongoose from 'mongoose';
import { z } from 'zod';

export const userRoleSchema = z.object({
  userId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'permissionId must be a valid MongoDB ObjectId',
  }),
  roleId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'roleId must be a valid MongoDB ObjectId',
  }),
});

export type UserRole = z.infer<typeof userRoleSchema>;
