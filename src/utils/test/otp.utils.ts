import supertest, { Response } from "supertest";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";
import { success } from "@/api/v1/auth/auth.constant";
import { OtpSchema, OtpType } from "@/api/v1/otp/otp.validation";
import { OtpService } from "../../api/v1/otp/otp.service";

export async function requestOTP(email: string): Promise<Response> {
  return supertest(app).post("/api/v1/otp").send({
    otpType: "sendEmailVerificationOTP",
    email,
  });
}

export function expectOTPRequestSuccess(response: Response): void {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.VERIFICATION_EMAIL_SENT);
}

export async function retrieveOTP(userId: string, otpType: OtpType): Promise<OtpSchema> {
  const otpDetails = await OtpService.getOtpDetailsByUserId({
    userId,
    otpType,
  });
  const otpData = otpDetails.find((data) => data.otpType === otpType);
  return otpData as OtpSchema;
}

export async function verifyOTP({ otp, otpType }: OtpSchema, email: string): Promise<Response> {
  return supertest(app).post("/api/v1/otp/verify").send({
    otpType,
    email,
    otp,
  });
}

export function expectOTPVerificationSuccess(response: Response): void {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.OTP_VERIFIED);
}
