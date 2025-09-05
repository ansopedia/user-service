import { Redis } from "ioredis";

import { errorLogger, logger } from "@/utils";

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis();

    this.client.on("connect", () => {
      logger.info("Connected to Redis!");
    });

    this.client.on("error", (err) => {
      errorLogger.error(`Redis error: ${err}`);
    });
  }

  async revokeJti(jti: string, exp: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    if (ttl <= 0) {
      logger.warn("Token already expired, skipping revoke");
      return;
    }

    await this.client.set(`bl_jti_${jti}`, "revoked", "EX", ttl);
    logger.info(`JTI ${jti} revoked for ${ttl} seconds`);
  }

  async isJtiRevoked(jti: string): Promise<boolean> {
    const exists = await this.client.get(`bl_jti_${jti}`);
    return exists !== null;
  }
}

export const redisService = new RedisService();
