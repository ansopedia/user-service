import { type Otp, otpSchema } from "@ansospace/types";

export const generateOTP = (length: number = 6): Otp => {
  const factor = Math.pow(10, length - 1);
  // eslint-disable-next-line sonarjs/pseudo-random
  return otpSchema.parse(Math.floor(factor + Math.random() * 9 * factor).toString());
};

export const verifyOTP = (otp: Otp, input: Otp): boolean => {
  return otp === input;
};
