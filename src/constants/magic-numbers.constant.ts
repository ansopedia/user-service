export const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;
export const DEFAULT_PAGINATION_LIMIT = 10;
export const MAX_PAGINATION_LIMIT = 100;
export const DEFAULT_PAGINATION_OFFSET = 0;

// Rate limit configuration
export const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 15;
export const RATE_LIMIT_MAX_REQUESTS = 100; // Limit each IP to 100 requests per windowMs
export const RATE_LIMIT_MESSAGE = "Too many requests from this IP, please try again later.";
