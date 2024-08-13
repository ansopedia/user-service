import { OtpModel } from './otp.modal';
import { GetOtp, OtpSchema, SaveOtp } from './otp.validation';

export class OtpDAL {
  static async saveOtp(otpSchema: SaveOtp) {
    const newOtp = new OtpModel(otpSchema);
    return await newOtp.save();
  }

  static async getOtp(otpSchema: GetOtp): Promise<OtpSchema | null> {
    return await OtpModel.findOne(otpSchema);
  }

  static async deleteOtp(otpId: string) {
    return await OtpModel.findByIdAndDelete(otpId);
  }

  static async deleteOtpByUserId(userId: string) {
    return await OtpModel.deleteMany({ userId });
  }

  static async replaceOtpForUser(otpSchema: SaveOtp) {
    return await OtpModel.findOneAndUpdate(
      { userId: otpSchema.userId, otpType: otpSchema.otpType },
      { ...otpSchema },
      { upsert: true, new: true },
    );
  }
}
