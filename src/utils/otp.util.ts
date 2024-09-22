import { OTP } from "@/api/v1/otp/otp.validation";

export const generateOTP = (length: number = 6): OTP => {
  const factor = Math.pow(10, length - 1);
  return Math.floor(factor + Math.random() * 9 * factor).toString();
};

export const verifyOTP = (otp: OTP, input: OTP) => {
  return otp === input;
};
