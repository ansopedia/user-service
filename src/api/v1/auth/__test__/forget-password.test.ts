import { defaultUsers } from "@/constants";
import {
  expectBadRequestResponseForValidationError,
  expectForgetPasswordSuccess,
  expectUserNotFoundError,
  forgetPassword,
} from "@/utils/test";

describe("Forget Password", () => {
  it("should throw error if email is not provided", async () => {
    const res = await forgetPassword("");
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if email is invalid", async () => {
    const res = await forgetPassword("a");
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if email is not registered", async () => {
    const res = await forgetPassword("a@a.com");
    expectUserNotFoundError(res);
  });

  it("should send forget password email", async () => {
    const res = await forgetPassword(defaultUsers.email);
    expectForgetPasswordSuccess(res);
  });
});
