export const ROUTES = {
  API_ROOT: "/api/v1",

  PLATFORMS: {
    ROOT: "/platforms",
    BY_SLUG: "/platforms/:slug",
  },

  USERS: {
    ROOT: "/users",
    CHECK_USERNAME: "/users/check-username/:username",
    BY_USERNAME: "/users/:username",
    BY_ID: "/users/:userId",
    RESTORE: "/users/:userId/restore",
    ASSIGN_ROLES: "/users/:userId/roles",
    ACCESS_CONTROL: "/users/:userId/access-control", // Allows an admin to see exactly what a specific user can do (useful for debugging "Why can't user X see this?").
  },

  PROFILE: {
    ROOT: "/profile", // made plural for consistency
    VISIBILITY: "/profile/visibility",
    ACCESS_CONTROL: "/profile/access-control", // Fetches the consolidated list of permissions, roles for the currently logged-in user.
  },

  OTP: {
    ROOT: "/otp",
    VERIFY: "/otp/verify",
  },

  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    AUTO_LOGIN: "/auth/auto-login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    LOGOUT_OTHERS: "/auth/logout-others",
    // eslint-disable-next-line -- Not a hardcoded password, just an route identifier
    RESET_PASSWORD: "/auth/reset-password",

    SESSIONS: "/auth/sessions",

    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },

  // RBAC routes
  ROLES: {
    ROOT: "/roles",
    PERMISSIONS: "/roles/:roleId/permissions",
  },

  PERMISSIONS: {
    ROOT: "/permissions", // Fetches the master list of all possible permissions in the system (used for creating new Roles).
  },

  USER_ROLES: {
    ROOT: "/users/:userId/roles",
    BY_ID: "/users/:userId/roles/:roleId",
  },
} as const;
