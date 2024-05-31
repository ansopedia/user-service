import { z } from 'zod';
import { validateEmail } from '../user/user.validation';

const otpType = z.enum(['verifyEmail', 'verifyPhoneNumber', 'resetPassword', 'forgetPassword']);

export const otpEvent = z
  .object({
    otpType,
    email: validateEmail.optional(),
    phoneNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (['verifyEmail', 'resetPassword', 'forgetPassword'].includes(data.otpType)) {
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
      } else if (data.otpType === 'verifyPhoneNumber') {
        if (data.phoneNumber !== undefined) {
          // TODO: Add phone number validation
          try {
            return z.string().startsWith('91').parse(data.phoneNumber);
          } catch (err) {
            const error = new z.ZodError([]);
            error.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Invalid Phone number',
              path: ['phoneNumber'],
            });
            throw error;
          }
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
      message: 'Invalid payload for the given optType',
      path: ['optType'],
    },
  );

export const otp = z.string().length(6);

export const otpSchema = z.object({
  otp,
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  expiryTime: z.date(),
  otpType,
});

export const validateOTP = (data: unknown) => otpSchema.parse(data);

export type OtpSchema = z.infer<typeof otpSchema>;
export type OTP = z.infer<typeof otp>;
export type OtpType = z.infer<typeof otpType>;
export type OtpEvent = z.infer<typeof otpEvent>;
