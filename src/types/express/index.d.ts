import { DeviceInfo, LoggedInUser } from "../index.ts";

declare global {
  namespace Express {
    interface Locals {
      loggedInUser: LoggedInUser;
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
