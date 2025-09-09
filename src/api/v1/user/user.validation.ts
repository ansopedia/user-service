import { z } from "zod";

import { mongooseObjectId, password, username } from "@/types";

export const userSchema = z.object({
  id: mongooseObjectId,
  googleId: z.string().optional(),
  username: username,
  email: z.string().email().trim().toLowerCase().min(1, "Email is required"),
  password: password,
  confirmPassword: password,
  isEmailVerified: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const DEFAULT_PAGINATION_LIMIT = 10;
const MAX_PAGINATION_LIMIT = 100;
const DEFAULT_PAGINATION_OFFSET = 0;

export const paginationSchema = z.object({
  limit: z
    .number()
    .int("Limit must be an integer")
    .min(DEFAULT_PAGINATION_LIMIT, `Limit must be at least ${DEFAULT_PAGINATION_LIMIT}`)
    .max(MAX_PAGINATION_LIMIT, `Limit must be at most ${MAX_PAGINATION_LIMIT}`)
    .default(DEFAULT_PAGINATION_LIMIT),
  offset: z
    .number()
    .int("Limit must be an integer")
    .min(DEFAULT_PAGINATION_OFFSET, `Offset must be at least ${DEFAULT_PAGINATION_OFFSET}`)
    .default(DEFAULT_PAGINATION_OFFSET),
});

const createUserWithGoogleSchema = userSchema
  .extend({
    googleId: z.string(),
  })
  .pick({
    email: true,
    username: true,
    isEmailVerified: true,
    googleId: true,
  });

const createUserWithEmailAndPasswordSchema = userSchema
  .pick({
    email: true,
    username: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

const registerSchema = z.union([createUserWithEmailAndPasswordSchema, createUserWithGoogleSchema]);

export const updateUserSchema = userSchema
  .partial() // Make all keys optional
  .refine((data) => {
    // Check if at least one key is present
    const hasValues = Object.values(data).some((value) => value !== undefined);
    if (!hasValues) {
      throw new Error("At least one field is required for user update");
    }
    return true;
  });

export const getUserSchema = userSchema.omit({
  password: true,
  confirmPassword: true,
  isDeleted: true,
});
export const resetPasswordSchema = userSchema
  .pick({ password: true, confirmPassword: true })
  .extend({
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match password",
    path: ["confirmPassword"],
  });

export type User = z.infer<typeof userSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

export const validateRegister = (data: unknown) => {
  return registerSchema.parse(data);
};

export const validateResetPasswordSchema = (data: unknown): ResetPassword => {
  return resetPasswordSchema.parse(data);
};

export const validatePagination = (data: Pagination) => {
  paginationSchema.parse(data);
};

export interface UserRolePermission {
  _id: string;
  username: string;
  email: string;
  roles: Role[];
  allPermissions: Permission[];
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
