import { isPast } from "date-fns";

import { success } from "@/api/v1/auth/auth.constant";
import { UserService } from "@/api/v1/user/user.service";
import { ErrorTypeEnum, FIVE_MINUTES_IN_MS, envConstants } from "@/constants";
import { NotificationType, UserActionType, notificationToActionMap } from "@/constants/events.constant";
import { notificationService } from "@/services/notification.services";
import { generateOTP, verifyOTP } from "@/utils";

import { TokenService } from "../token/token.service";
import { OtpDAL } from "./otp.dal";
import { GetOtp, OtpEvent, OtpSchema, OtpVerifyEvent, otpEvent, otpVerifyEvent } from "./otp.validation";

export class OtpService {
  public static async sendOtp(otpEvents: OtpEvent): Promise<{ message: string; token: string }> {
    const validOtpEvent = otpEvent.parse(otpEvents);
    const { otpType } = validOtpEvent;

    const otp = generateOTP();

    // if (validOtpEvent.otpType === NotificationType.PHONE_VERIFICATION) {
    //   throw new Error("Phone number verification is not currently supported.");
    // }

    let message: string = success.OTP_SENT;
    const user = await UserService.getUserByEmail(validOtpEvent.email as string);

    if (otpType === NotificationType.EMAIL_VERIFICATION_OTP) {
      if (user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_VERIFIED);

      message = success.VERIFICATION_EMAIL_SENT;

      await notificationService.sendEmail({
        to: user.email,
        eventType: otpType,
        payload: { otp, recipientName: user.username },
        subject: "Email Verification OTP",
      });
    }

    if (otpType === NotificationType.FORGET_PASSWORD_OTP) {
      message = success.FORGET_PASSWORD_EMAIL_SENT;

      await notificationService.sendEmail({
        to: user.email,
        eventType: otpType,
        payload: { otp, recipientName: user.username },
        subject: "Forget Password OTP",
      });
    }

    await OtpDAL.upsertOTP({
      userId: user.id,
      otp,
      otpType,
      expiryTime: new Date(Date.now() + FIVE_MINUTES_IN_MS),
    });

    // Generate a temporary token for the user
    const token = await new TokenService().createActionToken(user.id, notificationToActionMap[otpType]);

    return { message, token };
  }

  public static async verifyOtp(otpEvents: OtpVerifyEvent): Promise<{ message: string; token?: string }> {
    // Extract the token from the parsed event data
    const { otp, otpType, token: verificationToken } = otpVerifyEvent.parse(otpEvents);
    let actionToken; // Renamed to avoid conflict

    const isMasterOTP = envConstants.MASTER_OTP === otp;

    // Validate the temporary email verification token first
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(
      verificationToken,
      notificationToActionMap[otpType] // Dynamically determine the action type based on otpType
    );

    const otpDetails = await OtpService.getOtpDetailsByUserId({
      userId,
      otpType,
    });

    const otpData = otpDetails.find((data) => data.otpType === otpType);

    if (!otpData) throw new Error(ErrorTypeEnum.enum.OTP_NOT_REQUESTED);

    const otpToVerify = isMasterOTP && envConstants.NODE_ENV !== "production" ? envConstants.MASTER_OTP : otpData.otp;

    if (!verifyOTP(otpToVerify, otp as string)) throw new Error(ErrorTypeEnum.enum.INVALID_OTP);

    if (isPast(otpData.expiryTime)) throw new Error(ErrorTypeEnum.enum.OTP_EXPIRED);

    if (otpType === NotificationType.EMAIL_VERIFICATION_OTP) {
      await UserService.updateUser(userId, { isEmailVerified: true });
    } else if (otpType === NotificationType.FORGET_PASSWORD_OTP) {
      // This part remains the same, generating a new token for password reset
      actionToken = await tokenService.createActionToken(userId, UserActionType.RESET_PASSWORD);
    }

    // Delete the OTP record after successful verification
    await OtpDAL.deleteOtp(otpData.id);

    // Invalidate the temporary access token
    await tokenService.invalidateToken(tokenId);

    return { message: success.OTP_VERIFIED, token: actionToken }; // Return the action token if generated
  }

  public static async getOtpDetailsByUserId(getOtpDetails: GetOtp): Promise<OtpSchema[]> {
    const otpDetails = await OtpDAL.getOtpDetailsByUserId(getOtpDetails);

    if (!otpDetails) throw new Error(ErrorTypeEnum.enum.OTP_NOT_REQUESTED);

    return otpDetails;
  }
}
