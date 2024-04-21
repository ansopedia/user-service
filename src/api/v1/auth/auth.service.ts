import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';
import { comparePassword } from '../../../utils/password.util';
import { UserDAL } from '../user/user.dal';
import { UserService } from '../user/user.service';
import { CreateUser } from '../user/user.validation';
import { AuthDAL } from './auth.dal';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt.util';
import { loginSchema, Login, AuthToken } from './auth.validation';

export class AuthService {
  public static async signUp(userData: CreateUser) {
    await UserService.createUser(userData);

    // TODO: Send verification email
  }

  public static async signInWithEmailAndPassword(userData: Login): Promise<AuthToken> {
    const validUserData = loginSchema.parse(userData);

    const user = await UserDAL.getUserByEmail(validUserData.email);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const isPasswordMatch = await comparePassword(validUserData.password, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);

    if (user.isDeleted) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    const newAuthToken = await AuthDAL.updateAuthTokens({ userId: user.id, refreshToken });

    if (!newAuthToken) await AuthDAL.createAuth({ userId: user.id, refreshToken });

    return { userId: user.id, accessToken, refreshToken };
  }

  public static async signOut(userId: string) {
    return await AuthDAL.deleteAuth(userId);
  }
}
