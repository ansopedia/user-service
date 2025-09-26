import { emailSchema, mongooseObjectId, otpSchema as otp } from "@ansospace/types";
import mongoose from "mongoose";
import { z } from "zod";

import { NotificationType, notificationTypeSchema } from "@/constants";

mongooseObjectId.transform((val) => new mongoose.Types.ObjectId(val));

// import { mongooseObjectId } from "@/types";

// Define separate schemas for each OTP type
const emailVerificationOtpSchema = z.object({
  otpType: z.literal(NotificationType.EMAIL_VERIFICATION_OTP),
  email: emailSchema,
});

const forgetPasswordOtpSchema = z.object({
  otpType: z.literal(NotificationType.FORGET_PASSWORD_OTP),
  email: emailSchema,
});

// const phoneVerificationOtpSchema = z.object({
//   otpType: z.literal(NotificationType.PHONE_VERIFICATION),
//   phoneNumber: z.string().min(1, "Phone number is required"),
// });

// Use discriminatedUnion with the separate schemas
export const otpEvent = z.discriminatedUnion("otpType", [
  emailVerificationOtpSchema,
  forgetPasswordOtpSchema,
  // phoneVerificationOtpSchema,
]);

export const otpVerifyEvent = z.object({
  otp: otp,
  otpType: notificationTypeSchema,
  token: z.string().min(1, "Token is required"),
});

export const otpSchema = z.object({
  id: mongooseObjectId,
  otp,
  userId: mongooseObjectId,
  expiryTime: z.date(),
  otpType: notificationTypeSchema,
});

export const saveOtpSchema = otpSchema.omit({ id: true });
export const getOtpSchema = otpSchema.pick({
  userId: true,
  otpType: true,
});

// Update types based on the new schemas
export type OtpSchema = z.infer<typeof otpSchema>;
export type OtpEvent = z.infer<typeof otpEvent>;
export type GetOtp = z.infer<typeof getOtpSchema>;
export type SaveOtp = z.infer<typeof saveOtpSchema>;
export type OtpVerifyEvent = z.infer<typeof otpVerifyEvent>;
