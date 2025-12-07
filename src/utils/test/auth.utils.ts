import {
  type LoginRequest,
  NotificationType,
  type RegisterResponse,
  type ResetPasswordRequest,
} from "@ansospace/types";
import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/auth/auth.constant.js";
import { ErrorTypeEnum, STATUS_CODES, errorMap } from "@/constants";

import { app } from "../../app.js";
import { expectOTPVerificationSuccess, retrieveOTP, verifyOTP } from "./otp.utils.js";

export const login = async (loginData: Omit<LoginRequest, "deviceInfo">): Promise<Response> => {
  return supertest(app).post("/api/v1/auth/login").send(loginData);
};

export const expectLoginSuccess = (response: Response): void => {
  const { statusCode, headers, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  const authorizationHeader = headers["authorization"];
  expect(authorizationHeader).toBeDefined();

  const refreshToken = headers["refresh-token"];
  expect(refreshToken).toBeDefined();

  expect(body).toMatchObject({
    message: success.LOGGED_IN_SUCCESSFULLY,
    status: "success",
    data: {
      userId: expect.any(String),
    },
  });
};

export const expectLoginFailed = (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_CREDENTIALS];

  expect(response.statusCode).toBe(errorObject.httpStatusCode);
  expect(response.body.message).toBe(errorObject.body.message);
  expect(response.body.code).toBe(errorObject.body.code);
};

export const expectEmailNotVerifiedError = (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED];

  expect(response.statusCode).toBe(errorObject.httpStatusCode);
  expect(response.body.message).toBe(errorObject.body.message);
  expect(response.body.code).toBe(errorObject.body.code);
  expect(response.body.status).toBe("failed");
};

export const signUp = async (signUpData: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}): Promise<Response> => {
  return await supertest(app).post("/api/v1/auth/register").send(signUpData);
};

export const expectSignUpSuccess = (response: Response): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.SIGN_UP_SUCCESS,
    data: {
      actionToken: expect.any(String),
      userId: expect.any(String),
    },
  });
};

export const logoutUser = async (authorizationHeader: string) => {
  return await supertest(app).post("/api/v1/auth/logout").set("authorization", authorizationHeader);
};

export const expectLogoutSuccess = (response: Response) => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body).toMatchObject({
    message: success.LOGGED_OUT_SUCCESSFULLY,
    status: "success",
  });
};

export const renewToken = async (refreshToken: string) => {
  return await supertest(app).post("/api/v1/auth/refresh").send({ refreshToken });
};

export const expectRenewTokenSuccess = (response: Response) => {
  const { statusCode, headers } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  const authorizationHeader = headers["authorization"];
  expect(authorizationHeader).toBeDefined();

  const refreshToken = headers["refresh-token"];
  expect(refreshToken).toBeDefined();

  expect(response.body).toMatchObject({
    message: success.TOKEN_RENEWED_SUCCESSFULLY,
    status: "success",
  });
};

export const expectRenewTokenFailed = (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.SESSION_INACTIVE];

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.UNAUTHORIZED);

  expect(body).toMatchObject({
    message: errorObject.body.message,
    code: errorObject.body.code,
    status: "failed",
  });
};

export const verifyAccount = async ({ userId, actionToken }: RegisterResponse) => {
  const otpType = NotificationType.EMAIL_VERIFICATION_OTP;
  // Step 1: Retrieve OTP from database
  const otpData = await retrieveOTP(userId, otpType);

  // Step 2: Verify OTP
  const verifyResponse = await verifyOTP({
    otp: otpData.otp,
    actionToken,
    otpType,
  });
  expectOTPVerificationSuccess(otpType, verifyResponse);
};

export const expectForgetPasswordSuccess = (response: Response): void => {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.FORGET_PASSWORD_EMAIL_SENT,
    data: { actionToken: expect.any(String) },
  });
};

export const resetPassword = async (resetPassword: ResetPasswordRequest): Promise<Response> => {
  return supertest(app).post("/api/v1/auth/reset-password").send(resetPassword);
};

export const expectResetPasswordSuccess = (response: Response): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  expect(body).toMatchObject({
    message: success.PASSWORD_RESET_SUCCESSFULLY,
    status: "success",
  });
};

export const logoutOthers = async (authorizationHeader: string) => {
  return await supertest(app).post("/api/v1/auth/logout-others").set("authorization", authorizationHeader);
};
export const logoutAllSessions = async (authorizationHeader: string) => {
  return await supertest(app).post("/api/v1/auth/logout-all").set("authorization", authorizationHeader);
};

export const getSessions = async (authorizationHeader: string) => {
  return await supertest(app).get("/api/v1/auth/sessions").set("authorization", authorizationHeader);
};
