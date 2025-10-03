import type { OtpRecord } from "@ansospace/types";
import { Schema, model } from "mongoose";

const OtpSchemas = new Schema<OtpRecord>(
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

export const OtpModel = model<OtpRecord>("Otp", OtpSchemas);
