import type { AuthenticatedUser, DeviceInfo } from "@ansospace/types";

declare global {
  namespace Express {
    interface Locals {
      loggedInUser: AuthenticatedUser;
    }
    interface Request {
      deviceInfo?: DeviceInfo;
      security?: {
        riskScore: number;
        warnings: string[];
      };
    }
  }
}

export {}; // Required to make it a module
