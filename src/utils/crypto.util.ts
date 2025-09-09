import { ErrorTypeEnum, envConstants } from "@/constants";

import { errorLogger } from "./logger.js";

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class CryptoUtil {
  private static instance: CryptoUtil | null = null;
  private keyPair: KeyPair | null = null;

  private constructor() {}

  static getInstance(): CryptoUtil {
    CryptoUtil.instance ??= new CryptoUtil();
    return CryptoUtil.instance;
  }

  async loadKeys(): Promise<KeyPair> {
    if (this.keyPair) return this.keyPair;

    try {
      const publicKey = envConstants.PUBLIC_KEY;
      const privateKey = envConstants.PRIVATE_KEY;

      if (publicKey.length === 0 || privateKey.length === 0) {
        errorLogger.error("Public or private key not found in environment variables");
        throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
      }

      this.keyPair = { publicKey, privateKey };
      return this.keyPair;
    } catch (error) {
      errorLogger.error(`Error loading keys: ${error}`);
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
  }

  getPublicKey(): string {
    if (this.keyPair?.publicKey === null || this.keyPair?.publicKey === undefined) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
    return this.keyPair.publicKey;
  }

  getPrivateKey(): string {
    if (this.keyPair?.privateKey === null || this.keyPair?.privateKey === undefined) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
    return this.keyPair.privateKey;
  }
}
