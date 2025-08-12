import { Schema, model } from "mongoose";

import { OtpSchema } from "./otp.validation";

const OtpSchemas = new Schema<OtpSchema>(
  {
    otp: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

export const OtpModel = model<OtpSchema>("Otp", OtpSchemas);
