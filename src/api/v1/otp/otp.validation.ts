import { z } from 'zod';
import { validateEmail } from '../user/user.validation';

const otpType = z.enum(['sendEmailVerificationOTP', 'verifyPhoneNumber', 'resetPassword', 'forgetPassword']);
export const otp = z.string().length(6);

const baseSchema = z.object({
  otpType,
  email: validateEmail.optional(),
  phoneNumber: z.string().optional(),
});

type BaseSchema = z.infer<typeof baseSchema>;

const validateOtpEvent = (data: BaseSchema) => {
  if (['sendEmailVerificationOTP', 'resetPassword', 'forgetPassword'].includes(data.otpType)) {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
};

export const otpEvent = baseSchema.refine(validateOtpEvent, {
  message: 'Invalid payload for the given optType',
  path: ['optType'],
});

export const otpVerifyEvent = baseSchema
  .extend({
    otp,
  })
  .refine(validateOtpEvent, {
    message: 'Invalid payload for the given optType',
    path: ['optType'],
  });

export const otpSchema = z.object({
  id: z.string(),
  otp,
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
  expiryTime: z.date(),
  otpType,
});

export const saveOtpSchema = otpSchema.omit({ id: true });
export const getOtpSchema = otpSchema.omit({ expiryTime: true, otp: true, id: true });

export type OtpSchema = z.infer<typeof otpSchema>;
export type OTP = z.infer<typeof otp>;
export type OtpType = z.infer<typeof otpType>;
export type OtpEvent = z.infer<typeof otpEvent>;
export type GetOtp = z.infer<typeof getOtpSchema>;
export type SaveOtp = z.infer<typeof saveOtpSchema>;
export type OtpVerifyEvent = z.infer<typeof otpVerifyEvent>;
