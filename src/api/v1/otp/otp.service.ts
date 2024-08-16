import { envConstants, ErrorTypeEnum, FIVE_MINUTES_IN_MS } from '@/constants';
import { generateOTP, verifyOTP } from '@/utils';
import { success } from '../auth/auth.constant';
import { UserService } from '../user/user.service';
import { OtpDAL } from './otp.dal';
import { OtpEvent, otpEvent, OtpVerifyEvent, otpVerifyEvent } from './otp.validation';

export class OtpService {
  public static async sendOtp(otpEvents: OtpEvent): Promise<{ message: string }> {
    const { otpType, email } = otpEvent.parse(otpEvents);
    const otp = generateOTP();
    let message: string = success.OTP_SENT;

    const user = await UserService.getUserByEmail(email as string);

    if (otpType === 'verifyEmail') {
      if (user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_VERIFIED);

      message = success.VERIFICATION_EMAIL_SENT;

      // TODO:  EmailService.sendVerificationEmail({ email, otp });
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

    if (!otpData) throw new Error(ErrorTypeEnum.enum.INVALID_OTP);

    const otpToVerify = isMasterOTP && envConstants.NODE_ENV !== 'production' ? envConstants.MASTER_OTP : otpData.otp;

    if (!verifyOTP(otpToVerify, otp as string)) throw new Error(ErrorTypeEnum.enum.INVALID_OTP);

    if (otpData.expiryTime < new Date()) throw new Error(ErrorTypeEnum.enum.OTP_EXPIRED);

    if (otpType === 'verifyEmail') {
      await UserService.updateUser(user.id, { isEmailVerified: true });
    }

    await OtpDAL.deleteOtp(otpData.id);

    return { message: success.OTP_VERIFIED };
  }
}
