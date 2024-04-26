import { z } from 'zod';
import { eventTypes } from '../auth/auth.validation';

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

export const otp = z.string().length(6);

export const otpSchema = z.object({
  otp,
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  expiryTime: z.date().default(() => new Date(Date.now() + FIVE_MINUTES_IN_MS)),
  eventType: eventTypes,
});

export const validateOTP = (data: unknown) => otpSchema.parse(data);

export type OtpSchema = z.infer<typeof otpSchema>;
export type OTP = z.infer<typeof otp>;
