import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(3, 'username must be at least 3 characters')
    .max(18)
    .regex(/^[a-z]/i, 'username must start with a letter')
    .regex(/^[a-z0-9]*$/i, 'username can only contain alphanumeric characters')
    .transform((val) => val.toLowerCase().trim()),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema
  .omit({ id: true, createdAt: true, updatedAt: true, confirmPassword: true })
  .extend({
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password does not match password',
    path: ['confirmPassword'],
  });

export const updateUserSchema = userSchema.partial({ username: true, email: true, password: true });
export const getUserSchema = userSchema.omit({ password: true, confirmPassword: true });

export type User = z.infer<typeof userSchema>;
export type createUser = z.infer<typeof createUserSchema>;
export type getUser = z.infer<typeof getUserSchema>;
