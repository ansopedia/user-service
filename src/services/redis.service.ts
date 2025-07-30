import Redis from "ioredis";

import { errorLogger } from "../utils";

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD ?? undefined,
    });

    this.client.on("error", (err) => {
      errorLogger.error("Redis error:", err);
    });
  }

  // Add a token to the revocation list with expiration (in seconds)
  async revokeToken(tokenId: string, expiresInSeconds: number): Promise<void> {
    await this.client.set(`revoked_token:${tokenId}`, "revoked", "EX", expiresInSeconds);
  }

  // Check if a token is revoked
  async isTokenRevoked(tokenId: string): Promise<boolean> {
    const result = await this.client.get(`revoked_token:${tokenId}`);
    return result === "revoked";
  }
}

export const redisService = new RedisService();
