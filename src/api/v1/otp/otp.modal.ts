import { Schema, Types, model } from "mongoose";

import { OtpSchema } from "./otp.validation";

const OtpSchemas = new Schema<OtpSchema>(
  {
    otp: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: "userId must be a valid MongoDB ObjectId string",
      },
      ref: "User",
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

export const OtpModel = model<OtpSchema>("Otp", OtpSchemas);
