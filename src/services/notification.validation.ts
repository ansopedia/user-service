import { z } from "zod";

export enum NotificationType {
  // Email verification
  EMAIL_VERIFICATION_OTP = "emailVerificationOtp",
  // EMAIL_VERIFICATION_MAGIC_LINK = 'emailVerificationMagicLink',

  // Email changes
  // EMAIL_CHANGE_CONFIRMATION = 'emailChangeConfirmation',

  // Password operations
  FORGET_PASSWORD_OTP = "forgetPasswordOtp",
  PASSWORD_CHANGE_CONFIRMATION = "passwordChangeConfirmation",

  // Phone verification
  // PHONE_VERIFICATION = 'phoneVerification',

  // Future events (commented until implemented)
  // ACCOUNT_ACTIVATION = "accountActivation",
  // WELCOME = "welcome",
  // TWO_FACTOR_AUTH = "twoFactorAuth",
  // LOGIN_ATTEMPT_ALERT = "loginAttemptAlert",
  // ACCOUNT_DELETION_CONFIRMATION = "accountDeletionConfirmation",
  // EMAIL_SUBSCRIPTION_CONFIRMATION = "emailSubscriptionConfirmation",
  // PROFILE_UPDATE = "profileUpdate",
  // SECURITY_ALERT = "securityAlert",
  // INACTIVE_ACCOUNT_REMINDER = "inactiveAccountReminder",
  // PAYMENT_CONFIRMATION = "paymentConfirmation",
  // ORDER_SHIPPING_UPDATE = "orderShippingUpdate",
  // NEWSLETTER_OPT_IN = "newsletterOptIn",
  // ACCOUNT_LOCKOUT = "accountLockout",
  // PASSWORD_EXPIRATION_REMINDER = "passwordExpirationReminder",
}

export const emailValidator = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

export const otpValidator = z.string().length(6, "OTP must be exactly 6 characters");

//  Specific payload schemas
const emailVerificationOTPPayload = z.object({
  otp: otpValidator,
  recipientName: z.string().min(1, "Recipient name is required"),
  otpTTL: z.string().min(1, "otpTTL must be a non-empty string"), // (TTL = Time To Live)
});

// const emailVerificationMagicLinkPayload = z.object({
//   magicLink: z.string().url(),
// });

// const emailChangeConfirmationPayload = z.object({
//   newEmail: emailValidator,
// });

const passwordResetOTPPayload = z.object({
  otp: otpValidator,
  recipientName: z.string().min(1, "Recipient name is required"),
  otpTTL: z.string().min(1, "otpTTL must be a non-empty string"), // (TTL = Time To Live)
});

const passwordChangeConfirmationPayload = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
});

// Define the email notification schema
const emailNotification = z.discriminatedUnion("eventType", [
  z.object({
    to: emailValidator,
    eventType: z.literal(NotificationType.EMAIL_VERIFICATION_OTP),
    subject: z.string(),
    payload: emailVerificationOTPPayload,
  }),
  // z.object({
  //   to: emailValidator,
  //   eventType: z.literal(NotificationType.EMAIL_VERIFICATION_MAGIC_LINK),
  //   payload: emailVerificationMagicLinkPayload,
  //   subject: z.string(),
  // }),
  // z.object({
  //   to: emailValidator,
  //   eventType: z.literal(NotificationType.EMAIL_CHANGE_CONFIRMATION),
  //   payload: emailChangeConfirmationPayload,
  //   subject: z.string(),
  // }),
  z.object({
    to: emailValidator,
    eventType: z.literal(NotificationType.FORGET_PASSWORD_OTP),
    payload: passwordResetOTPPayload,
    subject: z.string(),
  }),
  z.object({
    to: emailValidator,
    eventType: z.literal(NotificationType.PASSWORD_CHANGE_CONFIRMATION),
    subject: z.string(),
    payload: passwordChangeConfirmationPayload,
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
        if (issue.code === "invalid_type" && issue.path.includes("payload")) {
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
export type EmailVerificationOTPPayload = z.infer<typeof emailVerificationOTPPayload>;
