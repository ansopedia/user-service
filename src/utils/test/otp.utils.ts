import supertest, { Response } from "supertest";

import { success } from "@/api/v1/auth/auth.constant";
import { OtpSchema, OtpType } from "@/api/v1/otp/otp.validation";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

import { OtpService } from "../../api/v1/otp/otp.service";

export const requestOTP = async (email: string): Promise<Response> => {
  return supertest(app).post("/api/v1/otp").send({
    otpType: "sendEmailVerificationOTP",
    email,
  });
};

export const expectOTPRequestSuccess = (response: Response): void => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.VERIFICATION_EMAIL_SENT);
};

export const retrieveOTP = async (userId: string, otpType: OtpType): Promise<OtpSchema> => {
  const otpDetails = await OtpService.getOtpDetailsByUserId({
    userId,
    otpType,
  });
  const otpData = otpDetails.find((data) => data.otpType === otpType);
  return otpData as OtpSchema;
};

export const verifyOTP = async ({ otp, otpType }: OtpSchema, email: string): Promise<Response> => {
  return supertest(app).post("/api/v1/otp/verify").send({
    otpType,
    email,
    otp,
  });
};

export const expectOTPVerificationSuccess = (response: Response): void => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.OTP_VERIFIED);
};
