import { z } from 'zod';
import { userSchema } from '../user/user.validation';

const AuthSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  refreshToken: z.string(),
});

const authToken = AuthSchema.extend({
  accessToken: z.string(),
});

export const jwtAccessTokenSchema = z.object({
  userId: z.string(),
});

export const jwtRefreshTokenSchema = z.object({
  id: z.string(),
});

export const loginSchema = userSchema.pick({ email: true, password: true });

export type JwtAccessToken = z.infer<typeof jwtAccessTokenSchema>;
export type JwtRefreshToken = z.infer<typeof jwtRefreshTokenSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Auth = z.infer<typeof AuthSchema>;
export type AuthToken = z.infer<typeof authToken>;
