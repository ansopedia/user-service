import { Schema, model } from "mongoose";
import { User } from "./user.validation";
import { hashPassword } from "@/utils";

const UserSchema = new Schema<User>(
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

UserSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();

  this.password = await hashPassword(this.password);

  next();
});

export const UserModel = model<User>("User", UserSchema);
