import { type CreateToken, type MongooseObjectId, type Token, TokenType } from "@ansospace/types";
import { isPast } from "date-fns";

import { ErrorTypeEnum, FIVE_MINUTES_IN_MS, UserActionType } from "@/constants";
import { errorLogger, generateActionToken, verifyJWTToken } from "@/utils";

import { TokenDAL } from "./token.dal.js";

export class TokenService {
  private tokenDAL: TokenDAL;

  constructor() {
    this.tokenDAL = new TokenDAL();
  }

  async createActionToken(userId: MongooseObjectId, action: UserActionType) {
    const token = generateActionToken({ userId, action });

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

  async verifyActionToken(token: string, action: UserActionType): Promise<Token> {
    try {
      const verifiedToken = await verifyJWTToken<Token>(token, TokenType.ACTION);

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
      errorLogger.error(`Action token verification error: ${error}`);
      throw error;
    }
  }

  async invalidateToken(tokenId: MongooseObjectId) {
    await this.tokenDAL.updateToken(tokenId, { isUsed: true });
  }
}
