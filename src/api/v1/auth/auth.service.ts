import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';
import { comparePassword } from '../../../utils/password.util';
import { UserDAL } from '../user/user.dal';
import { UserService } from '../user/user.service';
import { createUser } from '../user/user.validation';
import { AuthDAL } from './auth.dal';
import { generateAccessToken, generateRefreshToken } from './auth.util';
import { Auth, AuthUser, authUserSchema } from './auth.validation';

export class AuthService {
  public static async signUp(userData: createUser) {
    await UserService.createUser(userData);

    // TODO: Send verification email
  }

  public static async signInWithEmailAndPassword(userData: AuthUser): Promise<Auth> {
    const validUserData = authUserSchema.parse(userData);

    const user = await UserDAL.getUserByEmail(validUserData.email);

    if (!user) {
      throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);
    }

    const isPasswordMatch = await comparePassword(validUserData.password, user.password);

    if (!isPasswordMatch) {
      throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);
    }

    if (user.isDeleted) {
      throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);
    }

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    await AuthDAL.saveAuthTokens(user.id, accessToken, refreshToken);

    return { refreshToken, accessToken, userId: user.id };
  }
}
