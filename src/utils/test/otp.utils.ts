import {
  NotificationType,
  type ObjectId,
  type OtpRecord,
  type SendOtpRequest,
  type VerifyOtpRequest,
} from "@ansospace/types";
import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/auth/auth.constant.js";
import { OtpService } from "@/api/v1/otp/otp.service.js";
import { STATUS_CODES } from "@/constants";

import { app } from "../../app.js";

export const requestOTP = async (otpEvents: SendOtpRequest): Promise<Response> => {
  return supertest(app).post("/api/v1/otp").send(otpEvents);
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

export const retrieveOTP = async (userId: ObjectId, otpType: NotificationType): Promise<OtpRecord> => {
  const otpDetails = await OtpService.getOtpDetailsByUserId({
    userId,
    otpType,
  });
  const otpData = otpDetails.find((data) => data.otpType === otpType);
  return otpData as OtpRecord;
};

export const verifyOTP = async (data: VerifyOtpRequest): Promise<Response> => {
  return supertest(app).post("/api/v1/otp/verify").send(data);
};

export const expectOTPVerificationSuccess = (otpType: NotificationType, response: Response): void => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);

  const expectedMessages = new Map<NotificationType, string>([
    [NotificationType.EMAIL_VERIFICATION_OTP, success.EMAIL_VERIFIED_SUCCESSFULLY],
    [NotificationType.FORGET_PASSWORD_OTP, success.PASSWORD_RESET_SUCCESSFULLY],
  ]);

  const expectedMessage = expectedMessages.get(otpType) ?? success.OTP_VERIFIED_SUCCESSFULLY;

  expect(response.body).toMatchObject({
    message: expectedMessage,
    data: {
      actionToken: expect.any(String),
    },
  });
};
