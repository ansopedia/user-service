import { z } from 'zod';

export const username = z
  .string()
  .min(3, 'username must be at least 3 characters')
  .max(18, 'username must be at most 18 characters')
  .regex(/^[a-z]/i, 'username must start with a letter')
  .regex(/^[a-z0-9-_]*$/i, 'username can only contain alphanumeric characters, hyphens, and underscores')
  .transform((val) => val.toLowerCase().trim());

export const password = z.string().min(8, 'password must be at least 8 characters');

export const userSchema = z.object({
  id: z.string().uuid(),
  googleId: z.string().optional(),
  username: username,
  email: z.string().email().trim().toLowerCase(),
  password: password,
  confirmPassword: z.string(),
  isEmailVerified: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createUserWithGoogleSchema = userSchema.omit({
  password: true,
  confirmPassword: true,
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});

const createUserWithEmailAndPasswordSchema = userSchema
  .omit({
    googleId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
  })
  .extend({
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password does not match password',
    path: ['confirmPassword'],
  });

export const createUserSchema = z.union([createUserWithEmailAndPasswordSchema, createUserWithGoogleSchema]);

export const validateUsername = userSchema.pick({ username: true });
export const validateEmail = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

export const updateUserSchema = userSchema
  .partial() // Make all keys optional
  .refine((data) => {
    // Check if at least one key is present
    const hasValues = Object.values(data).some((value) => value !== undefined);
    if (!hasValues) {
      throw new Error('At least one field is required for user update');
    }
    return true;
  });

export const getUserSchema = userSchema.omit({ password: true, confirmPassword: true, isDeleted: true });

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
export type Email = z.infer<typeof validateEmail>;

export const validateCreateUser = (data: Partial<CreateUser>) => {
  if ('password' in data && typeof data.password === 'string') {
    return createUserWithEmailAndPasswordSchema.safeParse(data);
  }
  return createUserWithGoogleSchema.safeParse(data);
};

export interface UserRolePermission {
  _id: string;
  username: string;
  email: string;
  roles: Role[];
  allPermissions: AllPermission[];
}

export interface Role {
  roleId: string;
  roleName: string;
  roleDescription: string;
  permissions: Permission[];
}

export interface Permission {
  _id: string;
  name: string;
  description: string;
}

export interface AllPermission {
  _id: string;
  name: string;
  description: string;
}
