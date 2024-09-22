import { z } from "zod";

export const username = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(18, "username must be at most 18 characters")
  .regex(/^[a-z]/i, "username must start with a letter")
  .regex(/^[a-z0-9-_]*$/i, "username can only contain alphanumeric characters, hyphens, and underscores")
  .transform((val) => val.toLowerCase().trim());

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one numeric digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine(
    (password) => {
      const repeatedChars = /(.)\1{2,}/;
      return !repeatedChars.test(password);
    },
    {
      message: "Password should not contain repeated characters",
    }
  );

export const userSchema = z.object({
  id: z.string().uuid(),
  googleId: z.string().optional(),
  username: username,
  email: z.string().email().trim().toLowerCase(),
  password: password,
  confirmPassword: password,
  isEmailVerified: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
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

const createUserSchema = z.union([createUserWithEmailAndPasswordSchema, createUserWithGoogleSchema]);

export const validateUsername = userSchema.pick({ username: true });

export const validEmail = z
  .string({ message: "Email is required" })
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email format" })
  .transform((val) => val.toLowerCase().trim());

export const validateEmail = (email: string): string => {
  return validEmail.parse(email);
};

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
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
export type Email = z.infer<typeof validEmail>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export const validateCreateUser = (data: CreateUser) => {
  createUserSchema.parse(data);
};

export const validateResetPasswordSchema = (data: ResetPassword): { password: string; token: string } => {
  return resetPasswordSchema.parse(data);
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
