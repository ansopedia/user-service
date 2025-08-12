import { MongooseObjectId } from "../../../types";
import { OtpModel } from "./otp.model";
import { GetOtp, OtpSchema, SaveOtp } from "./otp.validation";

export class OtpDAL {
  static async saveOtp(otpSchema: SaveOtp) {
    const newOtp = new OtpModel(otpSchema);
    return await newOtp.save();
  }

  static async getOtpDetailsByUserId(otpSchema: GetOtp): Promise<OtpSchema[] | null> {
    return await OtpModel.find(otpSchema);
  }

  static async deleteOtp(otpId: MongooseObjectId) {
    return await OtpModel.findByIdAndDelete(otpId);
  }

  static async deleteOtpByUserId(userId: MongooseObjectId) {
    return await OtpModel.deleteMany({ userId });
  }

  static async upsertOTP(otpSchema: SaveOtp) {
    return await OtpModel.findOneAndUpdate(
      { userId: otpSchema.userId, otpType: otpSchema.otpType },
      { ...otpSchema },
      { upsert: true, new: true }
    );
  }
}
