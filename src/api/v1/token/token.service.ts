import { isPast } from "date-fns";

import { ErrorTypeEnum, FIVE_MINUTES_IN_MS } from "@/constants";
import { generateTokenForAction, logger, verifyJWTToken } from "@/utils";

import { TokenDAL } from "./token.dal";
import { CreateToken, Token, TokenAction } from "./token.validation";

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
      isUsed: false,
      expiryTime: new Date(Date.now() + FIVE_MINUTES_IN_MS),
    };

    await this.tokenDAL.upsertToken(tokenPayload);
    return token;
  }

  async verifyActionToken(token: string, action: TokenAction): Promise<Token> {
    try {
      const verifiedToken = await verifyJWTToken<Token>(token, "action");

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

      return verifiedToken;
    } catch (error) {
      logger.error(`Action token verification error: ${error}`);
      throw error;
    }
  }

  async invalidateToken(tokenId: string) {
    await this.tokenDAL.updateToken(tokenId, { isUsed: true });
  }
}
