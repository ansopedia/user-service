import type { GetOtp, ObjectId, OtpRecord, SaveOtp } from "@ansospace/types";

import { OtpModel } from "./otp.model.js";

export class OtpDAL {
  static async saveOtp(otpSchema: SaveOtp) {
    const newOtp = new OtpModel(otpSchema);
    return await newOtp.save();
  }

  static async getOtpDetailsByUserId(otpSchema: GetOtp): Promise<OtpRecord[] | null> {
    return await OtpModel.find(otpSchema);
  }

  static async deleteOtp(otpId: ObjectId) {
    return await OtpModel.findByIdAndDelete(otpId);
  }

  static async deleteOtpByUserId(userId: ObjectId) {
    return await OtpModel.deleteMany({ userId });
  }

  static async upsertOTP(otpSchema: SaveOtp) {
    return await OtpModel.findOneAndUpdate(
      { userId: otpSchema.userId, eventType: otpSchema.eventType },
      { ...otpSchema },
      { upsert: true, new: true }
    );
  }
}
