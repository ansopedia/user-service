import { z } from 'zod';
import { userSchema } from '../user/user.validation';

const AuthSchema = z.object({
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const jwtTokenSchema = z.object({
  id: z.string(),
});

export const authUserSchema = userSchema.pick({ email: true, password: true });

export type JwtToken = z.infer<typeof jwtTokenSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type Auth = z.infer<typeof AuthSchema>;
