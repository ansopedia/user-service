import { TokenModel } from "./token.model";
import { CreateToken, Token, UpdateToken } from "./token.validation";

interface ITokenDal {
  saveToken(data: Token): Promise<CreateToken>;
  getToken(token: string): Promise<Token | null>;
  getTokensByUserId(userId: string): Promise<Token[] | null>;
  updateToken(tokenId: string, data: Token): Promise<Token | null>;
  deleteToken(tokenId: string): Promise<Token | null>;
  upsertToken(createTokenSchema: CreateToken): Promise<Token | null>;
}

export class TokenDAL implements ITokenDal {
  async saveToken(data: CreateToken): Promise<Token> {
    return await TokenModel.create(data);
  }

  async getToken(token: string): Promise<Token | null> {
    return await TokenModel.findOne({ token });
  }

  async getTokensByUserId(userId: string): Promise<Token[] | null> {
    return await TokenModel.find({ userId });
  }

  async updateToken(tokenId: string, data: UpdateToken): Promise<Token | null> {
    return await TokenModel.findByIdAndUpdate(tokenId, data, { new: true });
  }

  async deleteToken(tokenId: string): Promise<Token | null> {
    return await TokenModel.findByIdAndDelete(tokenId);
  }

  async upsertToken(tokenSchema: CreateToken): Promise<Token | null> {
    return await TokenModel.findOneAndUpdate(
      { userId: tokenSchema.userId, action: tokenSchema.action },
      { ...tokenSchema, $inc: { requestAttempts: 1 } },
      { upsert: true, new: true }
    );
  }
}

export default TokenDAL;
