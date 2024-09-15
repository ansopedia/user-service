import { generateTokenForAction, verifyJWTToken } from '@/utils';
import { TokenDAL } from './token.dal';
import { CreateToken, Token, TokenAction } from './token.validation';
import { ErrorTypeEnum, FIVE_MINUTES_IN_MS } from '@/constants';
import { isPast } from 'date-fns';

export class TokenService {
  private tokenDAL: TokenDAL;

  constructor() {
    this.tokenDAL = new TokenDAL();
  }

  async createActionToken(userId: string, action: TokenAction) {
    const token = generateTokenForAction({ userId, action });

    const tokenPayload: CreateToken = {
      userId,
      action,
      token,
      expiryTime: new Date(Date.now() + FIVE_MINUTES_IN_MS),
    };

    await this.tokenDAL.replaceTokenForUser(tokenPayload);
    return token;
  }

  async verifyActionToken(token: string, action: TokenAction): Promise<Token> {
    const verifiedToken = await verifyJWTToken<Token>(token, 'action');

    // Check if the token is valid for the intended action
    // e.g. if the token is for changing subscription, then the action must be changeSubscription
    if (verifiedToken.action !== action) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN_TYPE);
    }

    const storedToken = await this.tokenDAL.getToken(token);

    if (!storedToken) {
      throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
    }

    if (storedToken.isUsed || isPast(storedToken.expiryTime)) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    }

    await this.tokenDAL.updateToken(storedToken.id, { isUsed: true });

    return verifiedToken;
  }
}
