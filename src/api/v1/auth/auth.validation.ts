import { z } from "zod";

import { deviceId, deviceInfoSchema, mongooseObjectId, otp } from "@/types";

import { tokenSchema } from "../token/token.validation.js";
import { userSchema } from "../user/user.validation.js";

const AuthSchema = z.object({
  userId: mongooseObjectId,
  refreshToken: z.string(),
  otp,
  accessToken: z.string(),
  device: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export const session = z.object({
  id: mongooseObjectId,
  userId: mongooseObjectId,
  refreshToken: z.string(),
  tokenVersion: z.number().default(0),
  lastActive: z.date().default(() => new Date()),
  createdAt: z.date(),
  updatedAt: z.date(),
  deviceId: deviceId,
  deviceInfo: deviceInfoSchema,
  isActive: z.boolean().optional().default(true),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

export const validateRefreshTokenSchema = (data: unknown) => {
  return refreshTokenSchema.parse(data);
};

export const authToken = AuthSchema.pick({
  userId: true,
  accessToken: true,
  refreshToken: true,
});

const accessTokenPayload = z.object({
  userId: mongooseObjectId,
  deviceId: deviceId,
  tokenVersion: z.number(),
  permissions: z.array(z.string()),
});

export const validateAccessTokenPayload = (data: unknown) => {
  return accessTokenPayload.parse(data);
};

const refreshTokenPayload = z.object({
  sessionId: mongooseObjectId,
});

export const validateRefreshTokenPayload = (data: unknown) => {
  return refreshTokenPayload.parse(data);
};

const actionTokenPayload = z.object({
  userId: mongooseObjectId,
  action: tokenSchema.shape.action,
});

export const validateActionTokenPayload = (data: unknown) => {
  return actionTokenPayload.parse(data);
};

export const loginSchema = z
  .object({
    email: userSchema.shape.email.optional(),
    username: userSchema.shape.username.optional(),
    password: userSchema.shape.password,
  })
  .superRefine((data, ctx) => {
    if (data.email == null && data.username == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide either an email or a username",
        path: ["email", "username"],
      });
    }
    if (data.password == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
    }
  });

const SignUpResponse = z.object({
  userId: mongooseObjectId,
  token: z.string(),
});

export type SignUpResponse = z.infer<typeof SignUpResponse>;

export type AccessTokenPayload = z.infer<typeof accessTokenPayload>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayload>;
export type ActionTokenPayload = z.infer<typeof actionTokenPayload>;
export type Login = z.infer<typeof loginSchema>;
export type AuthToken = z.infer<typeof authToken>;
export type Session = z.infer<typeof session>;
