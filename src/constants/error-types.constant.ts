import { z } from "zod";

import { STATUS_CODES } from "./status-code.constant";

const errorType = [
  "VALIDATION_ERROR",
  "DUPLICATE_KEY_VALUE",
  "INTERNAL_SERVER_ERROR",
  "RESOURCE_NOT_FOUND",
  "EMAIL_ALREADY_EXISTS",
  "USER_NAME_ALREADY_EXISTS",
  "ROLE_ALREADY_EXISTS",
  "ROLE_NOT_FOUND",
  "USER_NOT_FOUND",
  "PERMISSION_ALREADY_EXISTS",
  "PERMISSION_NOT_FOUND",
  "ROLE_PERMISSION_ALREADY_EXISTS",
  "USER_ROLE_ALREADY_EXISTS",
  "INVALID_CREDENTIALS",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NO_AUTH_HEADER",
  "INVALID_ACCESS",
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "INVALID_TOKEN_TYPE",
  "ORIGIN_NOT_ALLOWED",
  "EMAIL_ALREADY_VERIFIED",
  "EMAIL_NOT_VERIFIED",
  "OTP_NOT_REQUESTED",
  "INVALID_OTP",
  "OTP_EXPIRED",
  "INITIAL_SETUP_FAILED",
  "NOT_ENOUGH_PERMISSION",
  "TOO_MANY_REQUESTS",
  "TOKEN_NOT_ACTIVE",
  "INVALID_TOKEN_AUDIENCE",
  "NOTIFICATION_SERVICE_UNAVAILABLE",
  "NOTIFICATION_SERVICE_MISCONFIGURED",
  "PROFILE_NOT_FOUND",
  "PROFILE_REQUIRED_FOR_VISIBILITY_CHANGE",
] as const;

export const ErrorTypeEnum = z.enum(errorType);

export const errorMap = {
  [ErrorTypeEnum.enum.VALIDATION_ERROR]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: {
      code: "validation_error",
      message: "Invalid input data. Please check and retry.",
    },
  },
  [ErrorTypeEnum.enum.DUPLICATE_KEY_VALUE]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_key_value",
      message: "Record already exists. Use a different value.",
    },
  },
  [ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR]: {
    httpStatusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    body: {
      code: "internal_server_error",
      message: "Server error. Please try again later.",
    },
  },
  [ErrorTypeEnum.enum.RESOURCE_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: {
      code: "resource_not_found",
      message: "Resource not found. Check identifier and retry.",
    },
  },
  [ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_email",
      message: "Email already registered. Use another or login.",
    },
  },
  [ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_username",
      message: "Username already taken. Choose another username.",
    },
  },
  [ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_role",
      message: "Role already exists. Use a different name.",
    },
  },
  [ErrorTypeEnum.enum.ROLE_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: {
      code: "role_not_found",
      message: "Role not found. Check identifier and retry.",
    },
  },
  [ErrorTypeEnum.enum.USER_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: {
      code: "user_not_found",
      message: "User not found. Check identifier and retry.",
    },
  },
  [ErrorTypeEnum.enum.PERMISSION_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_permission",
      message: "Permission already exists. Use a different name.",
    },
  },
  [ErrorTypeEnum.enum.PERMISSION_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: {
      code: "permission_not_found",
      message: "Permission not found. Check identifier and retry.",
    },
  },
  [ErrorTypeEnum.enum.ROLE_PERMISSION_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_role_permission",
      message: "Permission already assigned to this role.",
    },
  },
  [ErrorTypeEnum.enum.USER_ROLE_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "duplicate_user_role",
      message: "Role already assigned to this user.",
    },
  },
  [ErrorTypeEnum.enum.INVALID_CREDENTIALS]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "invalid_credentials",
      message: "Incorrect username or password.",
    },
  },
  [ErrorTypeEnum.enum.UNAUTHORIZED]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "unauthorized",
      message: "Authentication required.",
    },
  },
  [ErrorTypeEnum.enum.FORBIDDEN]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: {
      code: "forbidden",
      message: "Access denied.",
    },
  },
  [ErrorTypeEnum.enum.NO_AUTH_HEADER]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "no_auth_header",
      message: "Missing authorization header.",
    },
  },
  [ErrorTypeEnum.enum.INVALID_ACCESS]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "invalid_access",
      message: "Invalid credentials. Please login again.",
    },
  },
  [ErrorTypeEnum.enum.TOKEN_EXPIRED]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "token_expired",
      message: "Token expired. Please login again.",
    },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "invalid_token",
      message: "Invalid token. Please login again.",
    },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN_TYPE]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "invalid_token_type",
      message: "Unsupported token type.",
    },
  },
  [ErrorTypeEnum.enum.ORIGIN_NOT_ALLOWED]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: {
      code: "origin_not_allowed",
      message: "CORS error: Origin not allowed.",
    },
  },
  [ErrorTypeEnum.enum.EMAIL_ALREADY_VERIFIED]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: {
      code: "email_already_verified",
      message: "Email already verified.",
    },
  },
  [ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: {
      code: "email_not_verified",
      message: "Email verification required.",
    },
  },
  [ErrorTypeEnum.enum.OTP_NOT_REQUESTED]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: {
      code: "otp_not_requested",
      message: "No OTP requested. Initiate OTP request first.",
    },
  },
  [ErrorTypeEnum.enum.INVALID_OTP]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: {
      code: "invalid_otp",
      message: "Incorrect OTP. Try again or request new OTP.",
    },
  },
  [ErrorTypeEnum.enum.OTP_EXPIRED]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: {
      code: "otp_expired",
      message: "OTP expired. Request a new OTP.",
    },
  },
  [ErrorTypeEnum.enum.INITIAL_SETUP_FAILED]: {
    httpStatusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    body: {
      code: "initial_setup_failed",
      message: "System setup failed. Contact administrator.",
    },
  },
  [ErrorTypeEnum.enum.NOT_ENOUGH_PERMISSION]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: {
      code: "not_enough_permission",
      message: "Insufficient permissions for this action.",
    },
  },
  [ErrorTypeEnum.enum.TOO_MANY_REQUESTS]: {
    httpStatusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    body: {
      code: "too_many_requests",
      message: "Too many requests. Try again later.",
    },
  },
  [ErrorTypeEnum.enum.TOKEN_NOT_ACTIVE]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "token_not_active",
      message: "Token inactive. Get a new token.",
    },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN_AUDIENCE]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: {
      code: "invalid_token_audience",
      message: "Token not intended for this service.",
    },
  },
  [ErrorTypeEnum.enum.NOTIFICATION_SERVICE_UNAVAILABLE]: {
    httpStatusCode: STATUS_CODES.SERVICE_UNAVAILABLE,
    body: {
      code: "notification_service_unavailable",
      message: "Notification service unavailable.",
    },
  },
  [ErrorTypeEnum.enum.NOTIFICATION_SERVICE_MISCONFIGURED]: {
    httpStatusCode: STATUS_CODES.SERVICE_UNAVAILABLE,
    body: {
      code: "notification_service_misconfigured",
      message: "Notification service misconfigured.",
    },
  },
  [ErrorTypeEnum.enum.PROFILE_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: {
      code: "profile_not_found",
      message: "Profile not found.",
    },
  },
  [ErrorTypeEnum.enum.PROFILE_REQUIRED_FOR_VISIBILITY_CHANGE]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: {
      code: "profile_not_found",
      message: "Profile not found. A profile must exist to change its visibility.",
    },
  },
};

export type ErrorTypeEnum = z.infer<typeof ErrorTypeEnum>;
export type ErrorCode = (typeof errorMap)[keyof typeof errorMap]["body"]["code"];

export const getErrorObject = (type: ErrorTypeEnum) => {
  const validateErrorType = ErrorTypeEnum.safeParse(type);
  return validateErrorType.success ? errorMap[type] : errorMap[ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR];
};
