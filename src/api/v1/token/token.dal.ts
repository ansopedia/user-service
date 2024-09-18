import { TokenModel } from './token.model';
import { CreateToken, Token, UpdateToken } from './token.validation';

interface ITokenDal {
  saveToken(payload: Token): Promise<CreateToken>;
  getToken(token: string): Promise<Token | null>;
  getTokensByUserId(userId: string): Promise<Token[] | null>;
  updateToken(tokenId: string, payload: Token): Promise<Token | null>;
  deleteToken(tokenId: string): Promise<Token | null>;
  replaceTokenForUser(createTokenSchema: CreateToken): Promise<Token | null>;
}

export class TokenDAL implements ITokenDal {
  async saveToken(payload: CreateToken): Promise<Token> {
    return await TokenModel.create(payload);
  }

  async getToken(token: string): Promise<Token | null> {
    return await TokenModel.findOne({ token });
  }

  async getTokensByUserId(userId: string): Promise<Token[] | null> {
    return await TokenModel.find({ userId });
  }

  async updateToken(tokenId: string, payload: UpdateToken): Promise<Token | null> {
    return await TokenModel.findByIdAndUpdate(tokenId, payload, { new: true });
  }

  async deleteToken(tokenId: string): Promise<Token | null> {
    return await TokenModel.findByIdAndDelete(tokenId);
  }

  async replaceTokenForUser(tokenSchema: CreateToken): Promise<Token | null> {
    return await TokenModel.findOneAndUpdate(
      { userId: tokenSchema.userId, action: tokenSchema.action },
      { ...tokenSchema, $inc: { requestAttempts: 1 } },
      { upsert: true, new: true },
    );
  }
}

export default TokenDAL;
