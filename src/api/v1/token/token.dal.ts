import { TokenModel } from './token.model';
import { CreateToken, Token } from './token.validation';

interface ITokenDal {
  createToken(payload: Token): Promise<CreateToken>;
  getToken(token: string): Promise<Token | null>;
  getTokensByUserId(userId: string): Promise<Token[] | null>;
  updateToken(tokenId: string, payload: Token): Promise<Token | null>;
  deleteToken(tokenId: string): Promise<Token | null>;
}

export class TokenDAL implements ITokenDal {
  async createToken(payload: CreateToken): Promise<Token> {
    return await TokenModel.create(payload);
  }

  async getToken(token: string): Promise<Token | null> {
    return await TokenModel.findOne({ token });
  }

  async getTokensByUserId(userId: string): Promise<Token[] | null> {
    return await TokenModel.find({ userId });
  }

  async updateToken(tokenId: string, payload: Token): Promise<Token | null> {
    return await TokenModel.findByIdAndUpdate(tokenId, payload, { new: true });
  }

  async deleteToken(tokenId: string): Promise<Token | null> {
    return await TokenModel.findByIdAndDelete(tokenId);
  }
}

export default TokenDAL;
