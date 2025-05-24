/**
 * Centralized event type definitions for the application
 */
import { z } from "zod";

/**
 * User account action types that require verification or confirmation
 */
export enum UserActionType {
  // Authentication actions
  VERIFY_EMAIL = "verifyEmail",
  RESET_PASSWORD = "resetPassword",
  DELETE_ACCOUNT = "deleteAccount",
  CHANGE_SUBSCRIPTION = "changeSubscription",
  VERIFY_PHONE = "verifyPhone",
}

/**
 * Notification event types for various user communications
 */
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

/**
 * Mapping between notification types and user action types
 * This helps maintain consistency between the two systems
 */
export const notificationToActionMap: Record<NotificationType, UserActionType> = {
  [NotificationType.EMAIL_VERIFICATION_OTP]: UserActionType.VERIFY_EMAIL,
  // [NotificationType.EMAIL_VERIFICATION_MAGIC_LINK]: UserActionType.VERIFY_EMAIL,
  [NotificationType.FORGET_PASSWORD_OTP]: UserActionType.RESET_PASSWORD,
  [NotificationType.PASSWORD_CHANGE_CONFIRMATION]: UserActionType.RESET_PASSWORD,
  // [NotificationType.EMAIL_CHANGE_CONFIRMATION]: UserActionType.VERIFY_EMAIL,
  // [NotificationType.PHONE_VERIFICATION]: UserActionType.VERIFY_PHONE,
};

// Zod schemas for validation
export const userActionTypeSchema = z.nativeEnum(UserActionType);
export const notificationTypeSchema = z.nativeEnum(NotificationType);

// Type exports
export type UserAction = z.infer<typeof userActionTypeSchema>;
export type Notification = z.infer<typeof notificationTypeSchema>;
