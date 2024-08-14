import { Types } from 'mongoose';
import { z } from 'zod';

const roleSchema = z.object({
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
  updatedBy: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'updateBy must be a valid MongoDB ObjectId',
  }),
});

export const createRoleSchema = roleSchema.omit({ id: true, createdAt: true, updatedAt: true, updatedBy: true });

export const validateRoleName = roleSchema.pick({ name: true });

export const updateRoleSchema = roleSchema.partial({ name: true, description: true, updatedBy: true });
export const getRoleSchema = roleSchema.omit({ createdBy: true, updatedBy: true, isDeleted: true });

export type Role = z.infer<typeof roleSchema>;
export type createRole = z.infer<typeof createRoleSchema>;
export type getRole = z.infer<typeof getRoleSchema>;
