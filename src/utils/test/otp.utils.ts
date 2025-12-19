import {
  type ObjectId,
  type OtpEvents,
  type OtpRecord,
  type SendOtpRequest,
  type VerifyOtpRequest,
  otpEvents,
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
      actionToken: expect.any(String),
    },
  });
};

export const retrieveOTP = async (userId: ObjectId, eventType: OtpEvents): Promise<OtpRecord> => {
  const otpDetails = await OtpService.getOtpDetailsByUserId({
    userId,
    eventType,
  });
  const otpData = otpDetails.find((data) => data.eventType === eventType);
  return otpData as OtpRecord;
};

export const verifyOTP = async (data: VerifyOtpRequest): Promise<Response> => {
  return supertest(app).post("/api/v1/otp/verify").send(data);
};

export const expectOTPVerificationSuccess = (eventType: OtpEvents, response: Response): void => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);

  const expectedMessages = new Map<OtpEvents, string>([
    [otpEvents.enum.EMAIL_VERIFICATION, success.EMAIL_VERIFIED_SUCCESSFULLY],
    [otpEvents.enum.FORGET_PASSWORD, success.PASSWORD_RESET_SUCCESSFULLY],
  ]);

  const expectedMessage = expectedMessages.get(eventType) ?? success.OTP_VERIFIED_SUCCESSFULLY;

  expect(response.body).toMatchObject({
    message: expectedMessage,
    data: {
      actionToken: expect.any(String),
    },
  });
};
