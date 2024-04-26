import { z } from 'zod';
import { userSchema, validateEmail } from '../user/user.validation';

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

export const eventSchema = z
  .object({
    eventType: z.enum(['verifyEmail', 'verifyPhoneNumber']),
    email: validateEmail.optional(),
    phoneNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.eventType === 'verifyEmail') {
        if (data.email !== undefined) {
          return validateEmail.parse(data.email);
        } else {
          const error = new z.ZodError([]);
          error.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Email is required',
            path: ['email'],
          });
          throw error;
        }
      } else if (data.eventType === 'verifyPhoneNumber') {
        if (data.phoneNumber !== undefined) {
          // TODO: Add phone number validation
          return z.string().startsWith('91').parse(data.phoneNumber);
        } else {
          const error = new z.ZodError([]);
          error.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Phone number is required',
            path: ['phoneNumber'],
          });
          throw error;
        }
      }
      return false;
    },
    {
      message: 'Invalid payload for the given eventType',
      path: ['eventType'],
    },
  );

export type EventPayload = z.infer<typeof eventSchema>;
