import { type Password, otpSchema, passwordSchema } from "@ansospace/types";
import type { Response } from "supertest";

import { NotificationType, envConstants, mockUser } from "@/constants";
import {
  expectBadRequestResponseForValidationError,
  expectForgetPasswordSuccess,
  expectLoginFailed,
  expectLoginSuccess,
  expectOTPVerificationSuccess,
  expectResetPasswordSuccess,
  expectSignUpSuccess,
  forgetPassword,
  login,
  resetPassword,
  signUp,
  verifyAccount,
  verifyOTP,
} from "@/utils/test";

describe("Reset Password", () => {
  beforeAll(async () => {
    const signUpResponse = await signUp(mockUser);
    expectSignUpSuccess(signUpResponse);

    verifyAccount(signUpResponse.body.data);
  });

  it("should throw error if token, password, confirmPassword is not provided", async () => {
    const res = await resetPassword({
      token: "",
      password: "" as Password,
      confirmPassword: "" as Password,
    });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if token is invalid", async () => {
    const res = await resetPassword({
      token: "a",
      password: "a" as Password,
      confirmPassword: "a" as Password,
    });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if password and confirmPassword do not match", async () => {
    const res = await resetPassword({
      token: "a",
      password: "a" as Password,
      confirmPassword: "b" as Password,
    });
    expectBadRequestResponseForValidationError(res);
  });

  // should reset password again after isUsed flag is reset
  let verifiedOTPResponse: Response;
  it("should verify OTP successfully", async () => {
    const res = await forgetPassword(mockUser.email);
    expectForgetPasswordSuccess(res);

    const otpType = NotificationType.FORGET_PASSWORD_OTP;

    verifiedOTPResponse = await verifyOTP({
      otp: otpSchema.parse(envConstants.MASTER_OTP),
      token: res.body.data.token,
      otpType,
    });
    expectOTPVerificationSuccess(otpType, verifiedOTPResponse);
  });

  it("should reset password successfully", async () => {
    const { actionToken } = verifiedOTPResponse.body.data;

    const res = await resetPassword({
      token: actionToken,
      password: passwordSchema.parse("ValidPassword123@"),
      confirmPassword: passwordSchema.parse("ValidPassword123@"),
    });
    expectResetPasswordSuccess(res);
  });

  it("should not login with old password", async () => {
    const res = await login(mockUser);
    expectLoginFailed(res);
  });

  it("should login with new password", async () => {
    const res = await login({ ...mockUser, password: passwordSchema.parse("ValidPassword123@") });
    expectLoginSuccess(res);
  });
});
