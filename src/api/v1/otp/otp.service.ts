import {
  type GetOtp,
  type OtpRecord,
  type SendOtpRequest,
  type SendOtpResponse,
  type VerifyOtpRequest,
  emailNotificationEvents,
  otpEvents,
  otpSchema,
  sendOtpRequestSchema,
  sendOtpToActionMap,
  userActions,
  verifyOtpRequestSchema,
} from "@ansospace/types";
import { formatDuration, intervalToDuration, isPast } from "date-fns";

import { success } from "@/api/v1/auth/auth.constant.js";
import { UserService } from "@/api/v1/user/user.service.js";
import { ErrorTypeEnum, FIVE_MINUTES_IN_MS, envConstants } from "@/constants";
import { notificationService } from "@/services";
import { generateOTP, verifyOTP } from "@/utils";

import { TokenService } from "../token/token.service.js";
import { OtpDAL } from "./otp.dal.js";

export class OtpService {
  public static async sendOtp(otpRequest: SendOtpRequest): Promise<{ message: string } & SendOtpResponse> {
    const { eventType, email } = sendOtpRequestSchema.parse(otpRequest);

    const otp = generateOTP();
    const otpTTLDuration = intervalToDuration({ start: 0, end: FIVE_MINUTES_IN_MS });
    const otpTTL = formatDuration(otpTTLDuration);

    let message: string = success.OTP_SENT;
    const user = await UserService.getUserByEmail(email);

    if (eventType === otpEvents.enum.EMAIL_VERIFICATION) {
      if (user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_VERIFIED);

      message = success.VERIFICATION_EMAIL_SENT;

      await notificationService.sendEmail({
        to: user.email,
        eventType: emailNotificationEvents.enum.EMAIL_VERIFICATION_OTP,
        payload: { otp, recipientName: user.username, otpTTL },
        subject: "Email Verification OTP",
      });
    }

    if (eventType === otpEvents.enum.FORGET_PASSWORD) {
      message = success.FORGET_PASSWORD_EMAIL_SENT;

      await notificationService.sendEmail({
        to: user.email,
        eventType: emailNotificationEvents.enum.FORGET_PASSWORD_OTP,
        payload: { otp, recipientName: user.username, otpTTL },
        subject: "Forget Password OTP",
      });
    }

    await OtpDAL.upsertOTP({
      userId: user.id,
      otp,
      eventType,
      expiryTime: new Date(Date.now() + FIVE_MINUTES_IN_MS),
    });

    // Generate a temporary token for the user
    const actionToken = await new TokenService().createActionToken(user.id, sendOtpToActionMap[eventType]);

    return { message, actionToken };
  }

  public static async verifyOtp(verifyOtpRequest: VerifyOtpRequest): Promise<{ message: string; actionToken: string }> {
    // Extract the token from the parsed event data
    const { otp, eventType, actionToken: verificationToken } = verifyOtpRequestSchema.parse(verifyOtpRequest);
    let actionToken: string = "";
    let message: string = success.OTP_VERIFIED_SUCCESSFULLY;

    const isMasterOTP = envConstants.MASTER_OTP === otp;

    // Validate the temporary email verification token first
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(
      verificationToken,
      sendOtpToActionMap[eventType] // Dynamically determine the action type based on eventType
    );

    const otpDetails = await OtpService.getOtpDetailsByUserId({
      userId,
      eventType,
    });

    const otpData = otpDetails.find((data) => data.eventType === eventType);

    if (!otpData) throw new Error(ErrorTypeEnum.enum.OTP_NOT_REQUESTED);

    const otpToVerify = isMasterOTP && envConstants.NODE_ENV !== "production" ? envConstants.MASTER_OTP : otpData.otp;

    if (!verifyOTP(otpSchema.parse(otpToVerify), otp)) throw new Error(ErrorTypeEnum.enum.INVALID_OTP);

    if (isPast(otpData.expiryTime)) throw new Error(ErrorTypeEnum.enum.OTP_EXPIRED);

    if (eventType === otpEvents.enum.EMAIL_VERIFICATION) {
      await UserService.updateUser(userId, { isEmailVerified: true });
      message = success.EMAIL_VERIFIED_SUCCESSFULLY;
      actionToken = await tokenService.createActionToken(userId, userActions.enum.AUTO_LOGIN);
    } else if (eventType === otpEvents.enum.FORGET_PASSWORD) {
      actionToken = await tokenService.createActionToken(userId, userActions.enum.RESET_PASSWORD);
      message = success.PASSWORD_RESET_SUCCESSFULLY;
    }

    // Delete the OTP record after successful verification
    await OtpDAL.deleteOtp(otpData.id);

    // Invalidate the temporary access token
    await tokenService.invalidateToken(tokenId);

    return { message, actionToken };
  }

  public static async getOtpDetailsByUserId(getOtpDetails: GetOtp): Promise<OtpRecord[]> {
    const otpDetails = await OtpDAL.getOtpDetailsByUserId(getOtpDetails);

    if (!otpDetails) throw new Error(ErrorTypeEnum.enum.OTP_NOT_REQUESTED);

    return otpDetails;
  }
}
