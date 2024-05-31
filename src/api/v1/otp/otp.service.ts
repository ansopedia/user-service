import { FIVE_MINUTES_IN_MS } from '../../../constants';
import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';
import { generateOTP } from '../../../utils/otp.util';
import { success } from '../auth/auth.constant';
import { UserService } from '../user/user.service';
import { OtpDAL } from './otp.dal';
import { otpEvent, OtpType } from './otp.validation';

export class OTPService {
  public static async sendOtp(otpEvents: OtpType): Promise<{ message: string }> {
    const { otpType, email } = otpEvent.parse(otpEvents);
    const otp = generateOTP();
    let message: string = success.OTP_SENT;

    const user = await UserService.getUserByEmail(email as string);
    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    if (otpType === 'verifyEmail') {
      if (user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_VERIFIED);

      message = success.VERIFICATION_EMAIL_SENT;

      // TODO:  EmailService.sendVerificationEmail({ email, otp });
    }

    await OtpDAL.saveOtp({
      userId: user.id,
      otp,
      otpType,
      expiryTime: new Date(Date.now() + FIVE_MINUTES_IN_MS),
    });

    return { message };
  }
}
