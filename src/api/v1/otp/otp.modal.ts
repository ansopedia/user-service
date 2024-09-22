import { model, Schema } from "mongoose";
import { OtpSchema } from "./otp.validation";

const OtpSchema = new Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    otpType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const OtpModel = model<OtpSchema>("Otp", OtpSchema);
