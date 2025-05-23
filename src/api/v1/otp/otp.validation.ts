import { z } from "zod";

import { TokenAction } from "@/api/v1/token/token.validation";
import { userSchema } from "@/api/v1/user/user.validation";

export const otpType = ["sendEmailVerificationOTP", "verifyPhoneNumber", "sendForgetPasswordOTP"] as const;
// Corrected: Define OtpType as the Zod enum schema
export const OtpType = z.enum(otpType);

export const otp = z.string().length(6);

// Define separate schemas for each email OTP type
const sendEmailVerificationOtpSchema = z.object({
  otpType: z.literal(OtpType.enum.sendEmailVerificationOTP), // Use .enum to access the literal value
  email: userSchema.shape.email, // Use the existing email schema and make it required
  actionTokenType: z.literal(TokenAction.verifyEmail),
});

const sendForgetPasswordOtpSchema = z.object({
  otpType: z.literal(OtpType.enum.sendForgetPasswordOTP), // Use .enum to access the literal value
  email: userSchema.shape.email, // Use the existing email schema and make it required
  actionTokenType: z.literal(TokenAction.resetPassword),
});

const phoneOtpSchema = z.object({
  otpType: z.literal(OtpType.enum.verifyPhoneNumber), // Use .enum to access the literal value
  phoneNumber: z.string().min(1, "Phone number is required"), // Make phone number required
  actionTokenType: z.nativeEnum(TokenAction),
});

// Use discriminatedUnion with the separate schemas
export const otpEvent = z.discriminatedUnion("otpType", [
  sendEmailVerificationOtpSchema,
  sendForgetPasswordOtpSchema,
  phoneOtpSchema,
]);

export const otpVerifyEvent = z.object({
  otp,
  otpType: OtpType, // Use the OtpType schema directly
  token: z.string().min(1, "Token is required"),
});

export const otpSchema = z.object({
  id: z.string(),
  otp,
  userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
  expiryTime: z.date(),
  otpType: OtpType,
});

export const saveOtpSchema = otpSchema.omit({ id: true });
export const getOtpSchema = otpSchema.pick({
  userId: true,
  otpType: true,
});

// Update types based on the new schemas
export type OtpSchema = z.infer<typeof otpSchema>;
export type OTP = z.infer<typeof otp>;
export type OtpEvent = z.infer<typeof otpEvent>;
export type GetOtp = z.infer<typeof getOtpSchema>;
export type SaveOtp = z.infer<typeof saveOtpSchema>;
export type OtpVerifyEvent = z.infer<typeof otpVerifyEvent>;
export type OtpType = z.infer<typeof OtpType>;
