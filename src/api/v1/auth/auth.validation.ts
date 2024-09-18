import { z } from 'zod';
import { userSchema } from '../user/user.validation';
import { otp } from '../otp/otp.validation';
import { tokenSchema } from '../token/token.validation';

const AuthSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  refreshToken: z.string(),
  otp,
  accessToken: z.string(),
});

export const authToken = AuthSchema.pick({ userId: true, accessToken: true, refreshToken: true });

export const authenticateSchema = AuthSchema.pick({ refreshToken: true, userId: true });

export const jwtAccessTokenSchema = z.object({
  userId: z.string(),
});

export const jwtRefreshTokenSchema = z.object({
  id: z.string(),
});

export const jwtActionTokenSchema = z.object({
  userId: z.string(),
  action: tokenSchema.shape.action,
});

export const sendOtpSchema = z.object({
  payload: userSchema.shape.email,
  eventType: z.enum(['signUp', 'resetPassword', 'sendEmailVerificationOTP']),
});

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
        message: 'Please provide either an email or a username',
        path: ['email', 'username'],
      });
    }
    if (data.password == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password is required',
        path: ['password'],
      });
    }
  });

export const eventTypes = z.enum(['sendEmailVerificationOTP', 'verifyPhoneNumber']);

export type JwtAccessToken = z.infer<typeof jwtAccessTokenSchema>;
export type JwtRefreshToken = z.infer<typeof jwtRefreshTokenSchema>;
export type JwtActionToken = z.infer<typeof jwtActionTokenSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Auth = z.infer<typeof authenticateSchema>;
export type AuthToken = z.infer<typeof authToken>;
export type SendOtp = z.infer<typeof sendOtpSchema>;
export type EventTypes = z.infer<typeof eventTypes>;
