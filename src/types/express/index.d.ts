import { Auth } from "@/api/v1/auth/auth.validation";

declare global {
  namespace Express {
    interface Locals {
      loggedInUser: Auth;
    }
  }
}

export {}; // Required to make it a module
