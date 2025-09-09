import { Redis, type RedisOptions } from "ioredis";
import ms from "ms";

import { envConstants } from "@/constants";
import { errorLogger, logger } from "@/utils";

class RedisService {
  private client: Redis;

  constructor() {
    const redisConnectionStringProd: RedisOptions = {
      username: envConstants.REDIS_USERNAME,
      password: envConstants.REDIS_PASSWORD,
      port: envConstants.REDIS_PORT,
      host: envConstants.REDIS_HOST,
      db: envConstants.REDIS_DB,
    };

    this.client = envConstants.NODE_ENV === "production" ? new Redis(redisConnectionStringProd) : new Redis();

    this.client.on("connect", () => {
      logger.info("Connected to Redis!");
    });

    this.client.on("error", (err) => {
      errorLogger.error(`Redis error: ${err}`);
      throw new Error("Failed to connect to Redis");
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

  async setUserDeviceTokenVersion(userId: string, deviceId: string, tokenVersion: number): Promise<void> {
    const expireSeconds =
      typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string" && envConstants.ACCESS_TOKEN_EXPIRES_IN
        ? ms(envConstants.ACCESS_TOKEN_EXPIRES_IN)
        : (envConstants.ACCESS_TOKEN_EXPIRES_IN ?? 0) * 1000;

    await this.client.set(
      `user_device_token_version_${userId}_${deviceId}`,
      tokenVersion.toString(),
      "EX",
      expireSeconds
    );
  }

  async getUserDeviceTokenVersion(userId: string, deviceId: string): Promise<number | null> {
    const value = await this.client.get(`user_device_token_version_${userId}_${deviceId}`);
    if (value !== null) {
      return parseInt(value, 10);
    }
    return null;
  }
}

export const redisService = new RedisService();
