import { LoggedInUser } from "../index";

declare global {
  namespace Express {
    interface Locals {
      loggedInUser: LoggedInUser;
    }
  }
}

export {}; // Required to make it a module
