import { ZodError } from "zod";

import { NotificationType } from "@/constants/events.constant.js";

import { type OtpEvent, otpEvent } from "../otp.validation.js";

describe("Test OTP validation", () => {
  const otpTypes: OtpEvent = {
    otpType: NotificationType.EMAIL_VERIFICATION_OTP,
    email: "example@gmail.com",
  };

  it(`should throw error if email is not provided with otpType of ${NotificationType.EMAIL_VERIFICATION_OTP}`, () => {
    const otpTypesWithoutEmail = { ...otpTypes, email: undefined };

    try {
      otpEvent.parse(otpTypesWithoutEmail);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe("Required");
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
