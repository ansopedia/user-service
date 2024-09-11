import { envConstants, ErrorTypeEnum, FIVE_MINUTES_IN_MS } from '@/constants';
import { generateOTP, verifyOTP } from '@/utils';
import { success } from '@/api/v1/auth/auth.constant';
import { UserService } from '@/api/v1/user/user.service';
import { OtpDAL } from './otp.dal';
import { OtpEvent, otpEvent, OtpVerifyEvent, otpVerifyEvent } from './otp.validation';
import { notificationService } from '@/services/notification.services';

export class OtpService {
  public static async sendOtp(otpEvents: OtpEvent): Promise<{ message: string }> {
    const { otpType, email } = otpEvent.parse(otpEvents);

    const otp = generateOTP();

    let message: string = success.OTP_SENT;
    const user = await UserService.getUserByEmail(email as string);

    if (otpType === 'sendEmailVerificationOTP') {
      if (user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_VERIFIED);

      message = success.VERIFICATION_EMAIL_SENT;

      notificationService.sendEmail({
        to: user.email,
        eventType: otpType,
        payload: { otp },
      });
    }

    if (otpType === 'sendForgetPasswordOTP') {
      // TODO: If user try to forget password then logout him from all devices because of security reasons
      // because after verifying OTP he will get a token (access token) that will allow him to access all the resources with that token that we sent to him as a response.
      //
      message = success.FORGET_PASSWORD_EMAIL_SENT;

      notificationService.sendEmail({
        to: user.email,
        eventType: otpType,
        payload: { otp },
      });
    }

    await OtpDAL.replaceOtpForUser({
      userId: user.id,
      otp,
      otpType,
      expiryTime: new Date(Date.now() + FIVE_MINUTES_IN_MS),
    });

    return { message };
  }

  public static async verifyOtp(otpEvents: OtpVerifyEvent): Promise<{ message: string }> {
    const { otp, email, otpType } = otpVerifyEvent.parse(otpEvents);

    const user = await UserService.getUserByEmail(email as string);

    const isMasterOTP = envConstants.MASTER_OTP === otp;

    const otpData = await OtpDAL.getOtp({
      userId: user.id,
      otpType,
    });

    if (!otpData) throw new Error(ErrorTypeEnum.enum.OTP_NOT_REQUESTED);

    const otpToVerify = isMasterOTP && envConstants.NODE_ENV !== 'production' ? envConstants.MASTER_OTP : otpData.otp;

    if (!verifyOTP(otpToVerify, otp as string)) throw new Error(ErrorTypeEnum.enum.INVALID_OTP);

    if (otpData.expiryTime < new Date()) throw new Error(ErrorTypeEnum.enum.OTP_EXPIRED);

    if (otpType === 'sendEmailVerificationOTP') {
      await UserService.updateUser(user.id, { isEmailVerified: true });
    }

    if (otpType === 'sendForgetPasswordOTP') {
      // TODO: Generate new password reset token
      await UserService.updateUser(user.id, { password: otp });
    }

    await OtpDAL.deleteOtp(otpData.id);

    return { message: success.OTP_VERIFIED };
  }
}
