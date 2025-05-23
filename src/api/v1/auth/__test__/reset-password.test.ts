import { Response } from "supertest";

import {
  expectBadRequestResponseForValidationError,
  expectFindUserByUsernameSuccess,
  expectForgetPasswordSuccess,
  expectLoginFailed,
  expectLoginSuccess,
  expectOTPVerificationSuccess,
  expectResetPasswordSuccess,
  expectSignUpSuccess,
  findUserByUsername,
  forgetPassword,
  login,
  resetPassword,
  retrieveOTP,
  signUp,
  verifyAccount,
  verifyOTP,
} from "@/utils/test";

import { EmailEventType } from "../../../../services";
import { GetUser } from "../../user/user.validation";

const user = {
  username: "username",
  email: "validemail@example.com",
  password: "ValidPassword123!",
  confirmPassword: "ValidPassword123!",
};

describe("Reset Password", () => {
  beforeAll(async () => {
    const response = await signUp(user);
    expectSignUpSuccess(response);

    verifyAccount(user);
  });

  it("should throw error if token, password, confirmPassword is not provided", async () => {
    const res = await resetPassword({
      token: "",
      password: "",
      confirmPassword: "",
    });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if token is invalid", async () => {
    const res = await resetPassword({
      token: "a",
      password: "a",
      confirmPassword: "a",
    });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if password and confirmPassword do not match", async () => {
    const res = await resetPassword({
      token: "a",
      password: "a",
      confirmPassword: "b",
    });
    expectBadRequestResponseForValidationError(res);
  });

  // should reset password again after isUsed flag is reset
  let verifiedOTPResponse: Response;
  it("should verify OTP successfully", async () => {
    const res = await forgetPassword(user.email);
    expectForgetPasswordSuccess(res);

    const userResponse = await findUserByUsername(user.username);
    expectFindUserByUsernameSuccess(userResponse, user);
    const userDetails: GetUser = userResponse.body.data;

    const otpData = await retrieveOTP(userDetails.id, EmailEventType.sendForgetPasswordOTP);
    verifiedOTPResponse = await verifyOTP({
      otp: otpData.otp,
      token: res.body.data.token,
      otpType: EmailEventType.sendForgetPasswordOTP,
    });
    expectOTPVerificationSuccess(verifiedOTPResponse);
  });

  it("should reset password successfully", async () => {
    const { token } = verifiedOTPResponse.body.data;

    const res = await resetPassword({
      token,
      password: "ValidPassword123@",
      confirmPassword: "ValidPassword123@",
    });
    expectResetPasswordSuccess(res);
  });

  it("should not login with old password", async () => {
    const res = await login(user);
    expectLoginFailed(res);
  });

  it("should login with new password", async () => {
    const res = await login({ ...user, password: "ValidPassword123@" });
    expectLoginSuccess(res);
  });
});
