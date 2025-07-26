export const Tokens = {
  ACCESS: "access",
  REFRESH: "refresh",
  ACTION: "action",
} as const;
export type Tokens = (typeof Tokens)[keyof typeof Tokens];

export type LoggedInUser = {
  userId: string;
  permissions: string[];
};
