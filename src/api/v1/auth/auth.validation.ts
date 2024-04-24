import { z } from 'zod';
import { userSchema } from '../user/user.validation';

const AuthSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  refreshToken: z.string(),
  otp: z.string().length(6),
  accessToken: z.string(),
});

const authToken = AuthSchema.pick({ userId: true, accessToken: true, refreshToken: true });

export const authenticateSchema = AuthSchema.pick({ refreshToken: true, userId: true });

export const jwtAccessTokenSchema = z.object({
  userId: z.string(),
});

export const jwtRefreshTokenSchema = z.object({
  id: z.string(),
});

export const sendOtpSchema = z.object({
  payload: userSchema.shape.email,
  eventType: z.enum(['signUp', 'resetPassword', 'verifyEmail']),
});

export const loginSchema = userSchema.pick({ email: true, password: true });

export type JwtAccessToken = z.infer<typeof jwtAccessTokenSchema>;
export type JwtRefreshToken = z.infer<typeof jwtRefreshTokenSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Auth = z.infer<typeof authenticateSchema>;
export type AuthToken = z.infer<typeof authToken>;
export type SendOtp = z.infer<typeof sendOtpSchema>;
