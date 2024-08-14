import { Types } from 'mongoose';
import { z } from 'zod';

export const userRoleSchema = z.object({
  userId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'userId must be a valid MongoDB ObjectId',
  }),
  roleId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'roleId must be a valid MongoDB ObjectId',
  }),
});

export type UserRole = z.infer<typeof userRoleSchema>;
