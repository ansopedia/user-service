import supertest, { Response } from "supertest";

import { success } from "@/api/v1/auth/auth.constant";
import { Login, SignUpResponse } from "@/api/v1/auth/auth.validation";
import { app } from "@/app";
import { ErrorTypeEnum, STATUS_CODES, errorMap } from "@/constants";
import { NotificationType } from "@/constants/events.constant";

import { ResetPassword } from "../../api/v1/user/user.validation";
import { expectOTPVerificationSuccess, retrieveOTP, verifyOTP } from "./otp.utils";

export const login = async (loginData: Login): Promise<Response> => {
  return supertest(app).post("/api/v1/auth/sign-in").send(loginData);
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

export const signUp = async (signUpData: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}): Promise<Response> => {
  return await supertest(app).post("/api/v1/auth/sign-up").send(signUpData);
};

export const expectSignUpSuccess = (response: Response): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.SIGN_UP_SUCCESS,
    data: {
      token: expect.any(String),
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
  return await supertest(app).post("/api/v1/auth/refresh-token").set("authorization", refreshToken);
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
    data: {
      userId: expect.any(String),
    },
  });
};

export const verifyAccount = async ({ userId, token }: SignUpResponse) => {
  // Step 1: Retrieve OTP from database
  const otpData = await retrieveOTP(userId, NotificationType.EMAIL_VERIFICATION_OTP);

  // Step 2: Verify OTP
  const verifyResponse = await verifyOTP({
    otp: otpData.otp,
    token: token,
    otpType: NotificationType.EMAIL_VERIFICATION_OTP,
  });
  expectOTPVerificationSuccess(verifyResponse);
};

export const forgetPassword = async (email: string): Promise<Response> => {
  return supertest(app).post("/api/v1/auth/forget-password").send({ email });
};

export const expectForgetPasswordSuccess = (response: Response): void => {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.FORGET_PASSWORD_EMAIL_SENT,
    data: { token: expect.any(String) },
  });
};

export const resetPassword = async (resetPassword: ResetPassword): Promise<Response> => {
  return supertest(app).post("/api/v1/auth/reset-password").send(resetPassword);
};

export const expectResetPasswordSuccess = (response: Response): void => {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({ message: success.PASSWORD_RESET_SUCCESSFULLY });
};
