import { z } from 'zod';

// const EmailEventType = z.enum([
//   'sendEmailVerificationOTP',
//   'sendEmailVerificationMagicLink',
//   'sendEmailChangeConfirmation',
//   'sendForgetPasswordOTP',
//   'sendAccountActivationEmail',
//   'sendWelcomeEmail',
//   'sendTwoFactorAuthCode',
//   'sendLoginAttemptAlert',
//   'sendPasswordChangeConfirmation',
//   'sendAccountDeletionConfirmation',
//   'sendEmailSubscriptionConfirmation',
//   'sendProfileUpdateNotification',
//   'sendSecurityAlertEmail',
//   'sendInactiveAccountReminder',
//   'sendPaymentConfirmationEmail',
//   'sendOrderShippingUpdate',
//   'sendNewsletterOptInConfirmation',
//   'sendAccountLockoutNotification',
//   'sendPasswordExpirationReminder',
// ]);

export const emailValidator = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

export const otpValidator = z.string().length(6, 'OTP must be exactly 6 characters');

//  Specific payload schemas
const emailVerificationOTPPayload = z.object({
  otp: otpValidator,
});

const emailVerificationMagicLinkPayload = z.object({
  magicLink: z.string().url(),
});

const emailChangeConfirmationPayload = z.object({
  newEmail: emailValidator,
});

const passwordResetOTPPayload = z.object({
  otp: otpValidator,
});

// Define the email notification schema
const emailNotification = z.discriminatedUnion('eventType', [
  z.object({
    to: emailValidator,
    eventType: z.literal('sendEmailVerificationOTP'),
    subject: z.string().optional(),
    payload: emailVerificationOTPPayload,
  }),
  z.object({
    to: emailValidator,
    eventType: z.literal('sendEmailVerificationMagicLink'),
    subject: z.string().optional(),
    payload: emailVerificationMagicLinkPayload,
  }),
  z.object({
    to: emailValidator,
    eventType: z.literal('sendEmailChangeConfirmation'),
    subject: z.string().optional(),
    payload: emailChangeConfirmationPayload,
  }),
  z.object({
    to: emailValidator,
    eventType: z.literal('sendForgetPasswordOTP'),
    subject: z.string().optional(),
    payload: passwordResetOTPPayload,
  }),
  // ... Add other event types and their corresponding payloads ...
]);

export const validateEmailNotification = (data: EmailNotification) => {
  try {
    return emailNotification.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Customize error messages
      const customErrors = error.issues.map((issue) => {
        if (issue.code === 'invalid_type' && issue.path.includes('payload')) {
          const fieldName = issue.path[issue.path.length - 1];
          return {
            ...issue,
            message: `Missing required field: ${fieldName}`,
          };
        }
        return issue;
      });

      throw new z.ZodError(customErrors);
    }
    throw error;
  }
};

export type EmailNotification = z.infer<typeof emailNotification>;
