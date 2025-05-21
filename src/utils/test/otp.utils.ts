import supertest, { Response } from "supertest";

import { success } from "@/api/v1/auth/auth.constant";
import { OtpSchema, OtpType, OtpVerifyEvent } from "@/api/v1/otp/otp.validation";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

import { OtpService } from "../../api/v1/otp/otp.service";
import { EmailEventType } from "../../services";

export const requestOTP = async (email: string): Promise<Response> => {
  return supertest(app).post("/api/v1/otp").send({
    otpType: EmailEventType.sendEmailVerificationOTP,
    email,
  });
};

export const expectOTPRequestSuccess = (response: Response): void => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body).toMatchObject({
    message: success.VERIFICATION_EMAIL_SENT,
    data: {
      token: expect.any(String),
    },
  });
};

export const retrieveOTP = async (userId: string, otpType: OtpType): Promise<OtpSchema> => {
  const otpDetails = await OtpService.getOtpDetailsByUserId({
    userId,
    otpType,
  });
  const otpData = otpDetails.find((data) => data.otpType === otpType);
  return otpData as OtpSchema;
};

export const verifyOTP = async (data: OtpVerifyEvent): Promise<Response> => {
  return supertest(app).post("/api/v1/otp/verify").send(data);
};

export const expectOTPVerificationSuccess = (response: Response): void => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.OTP_VERIFIED);
};
