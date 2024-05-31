import { OtpModel } from './otp.modal';
import { OtpSchema } from './otp.validation';

export class OtpDAL {
  static async saveOtp(otpSchema: OtpSchema) {
    const newOtp = new OtpModel(otpSchema);
    return await newOtp.save();
  }
}
