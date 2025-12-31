/* eslint-disable sonarjs/no-hardcoded-passwords */
export const ROUTES = {
  API_ROOT: "/api/v1",

  PLATFORMS: {
    ROOT: "/platforms",
    BY_SLUG: "/platforms/:slug",
  },

  USERS: {
    ROOT: "/users",
    BY_USERNAME: "/users/:username",
    BY_ID: "/users/:userId",
    // RPC style actions on a resource are fine!
    CHECK_USERNAME: "/users/check-username/:username",
    RESTORE: "/users/:userId/restore",
    ASSIGN_ROLES: "/users/:userId/roles",
    ACCESS_CONTROL: "/users/:userId/access-control", // Allows an admin to see exactly what a specific user can do (useful for debugging "Why can't user X see this?").
  },

  PROFILE: {
    ROOT: "/profile",
    VISIBILITY: "/profile/visibility",
    ACCESS_CONTROL: "/profile/access-control", // Fetches the consolidated list of permissions, roles for the currently logged-in user.
  },

  // Managing active devices/tokens.
  SESSIONS: {
    ROOT: "/sessions",
    CURRENT: "/sessions/current",
    OTHERS: "/sessions/others",
    BY_ID: "/sessions/:sessionId",
  },

  // RBAC routes
  ROLES: {
    ROOT: "/roles",
    PERMISSIONS: "/roles/:roleId/permissions",
  },

  PERMISSIONS: {
    ROOT: "/permissions", // Fetches the master list of all possible permissions in the system (used for creating new Roles).
  },

  // --- ACTIONS (RPC Style) ---
  OTP: {
    ROOT: "/otp",
    VERIFY: "/otp/verify",
  },

  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    AUTO_LOGIN: "/auth/auto-login",
    REFRESH: "/auth/refresh",
    
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",

    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },
} as const;
