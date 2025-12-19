import { type OtpRecord, otpEvents } from "@ansospace/types";
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
    eventType: {
      type: String,
      enum: otpEvents.options,
      required: true,
    },
  },
  { timestamps: true }
);

export const OtpModel = model<OtpRecord>("Otp", OtpSchemas);
