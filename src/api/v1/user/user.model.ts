import type { User } from "@ansospace/types";
import { Document, Schema, model } from "mongoose";

import { hashPassword } from "@/utils";

interface IUser extends Document, User {}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 18,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (): Promise<void> {
  if (this.isModified("password") && this.password) this.password = await hashPassword(this.password);
});

export const UserModel = model<IUser>("User", userSchema);
