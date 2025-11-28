import { type SendOtpRequest, sendOtpRequestSchema } from "@ansospace/types";
import { ZodError } from "zod";

import { NotificationType } from "@/constants";

describe("Test OTP validation", () => {
  const otpTypes: SendOtpRequest = {
    otpType: NotificationType.EMAIL_VERIFICATION_OTP,
    email: "example@gmail.com",
  };

  it(`should throw error if email is not provided with otpType of ${NotificationType.EMAIL_VERIFICATION_OTP}`, () => {
    const otpTypesWithoutEmail = { ...otpTypes, email: undefined };

    try {
      sendOtpRequestSchema.parse(otpTypesWithoutEmail);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe("Email is required");
      expect((error as ZodError).errors[0].path).toEqual(["email"]);
    }
  });

  // it("should throw error if phone number is not provided", () => {
  //   const otpTypesWithoutPhoneNumber = { otpType: NotificationType.PHONE_VERIFICATION };

  //   try {
  //     otpEvent.parse(otpTypesWithoutPhoneNumber);
  //   } catch (error) {
  //     expect((error as ZodError).errors[0].message).toBe("Required");
  //     expect((error as ZodError).errors[0].path).toEqual(["phoneNumber"]);
  //   }
  // });
});
