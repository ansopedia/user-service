import { ErrorMessagesGroup } from './error-message.interface';

export const GENERAL_ERRORS: ErrorMessagesGroup = {
  TIMEOUT_ERROR: 'Request timed out. Please try again later.',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  NETWORK_ERROR: 'Network error occurred. Please check your internet connection.',
  INVALID_REQUEST_FORMAT: 'Invalid request format. Please check your request data.',
  RESOURCE_NOT_FOUND_ERROR: 'Resource not found. Please verify the URL and try again.',
  FORBIDDEN_ERROR: 'Access forbidden. You do not have permission to access this resource.',
};

export const AUTHENTICATION_ERRORS: ErrorMessagesGroup = {
  TOKEN_MISSING_ERROR: 'Authentication token missing. Please log in to continue.',
  TOKEN_EXPIRED_ERROR: 'Your session has expired. Please log in again to continue.',
  PASSWORD_RESET_REQUIRED_ERROR: 'Password reset required. Please check your email for instructions.',
  TOKEN_INVALID_ERROR:
    'The authentication token is either invalid or has been tampered with. Please try logging in again.',
};

export const AUTHORIZATION_ERRORS: ErrorMessagesGroup = {
  UNAUTHORIZED_ERROR: 'Unauthorized access. Please ensure you are logged in.',
  INSUFFICIENT_PERMISSIONS_ERROR: 'You do not have sufficient permissions to perform this action.',
};

export const INPUT_VALIDATION_ERRORS: ErrorMessagesGroup = {
  MISSING_REQUIRED_FIELD_ERROR: 'Please fill in all required fields.',
  INVALID_DATE_FORMAT_ERROR: 'Invalid date format. Please enter a valid date.',
  INVALID_PHONE_NUMBER_ERROR: 'Invalid phone number format. Please enter a valid phone number.',
};

export const EMAIL_VALIDATION_ERRORS: ErrorMessagesGroup = {
  EMAIL_EMPTY_ERROR: 'Email is required. Please enter your email address.',
  EMAIL_INVALID_ERROR: 'Invalid email format. Please enter a valid email address.',
};

export const PASSWORD_VALIDATION_ERRORS: ErrorMessagesGroup = {
  PASSWORD_EMPTY_ERROR: 'Password is required. Please enter your password.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
  PASSWORD_MISSING_NUMBER: 'Password must contain at least 1 number.',
  PASSWORD_MISSING_LOWERCASE: 'Password must contain at least 1 lowercase letter.',
  PASSWORD_MISSING_UPPERCASE: 'Password must contain at least 1 uppercase letter.',
  PASSWORD_MISSING_CASE_VARIATION: 'Password must contain at least 1 uppercase letter and 1 lowercase letter.',
};

export const CONFIRM_PASSWORD_VALIDATION_ERRORS: ErrorMessagesGroup = {
  CONFIRM_PASSWORD_EMPTY_ERROR: 'Confirm password is required. Please confirm your password.',
  CONFIRM_PASSWORD_MISMATCH_ERROR: 'Passwords do not match. Please ensure both passwords are identical.',
};

export const PASSWORD_RESET_ERRORS: ErrorMessagesGroup = {
  INVALID_PASSWORD_RESET_TOKEN_ERROR: 'Invalid password reset token. Please check your email and try again.',
  PASSWORD_RESET_TOKEN_EXPIRED_ERROR: 'Password reset token has expired. Please check your email and try again.',
};

export const PASSWORD_UPDATE_ERRORS: ErrorMessagesGroup = {
  INVALID_CURRENT_PASSWORD_ERROR: 'Invalid current password. Please try again.',
  PASSWORD_UPDATE_FAILED_ERROR: 'An error occurred while updating your password. Please try again.',
};

export const EMAIL_UPDATE_ERRORS: ErrorMessagesGroup = {
  EMAIL_ALREADY_EXISTS_ERROR: 'Email already exists. Please choose a different email.',
  EMAIL_UPDATE_FAILED_ERROR: 'An error occurred while updating your email. Please try again.',
};

export const USER_REGISTRATION_ERRORS: ErrorMessagesGroup = {
  INVALID_NAME_ERROR: 'Invalid name. Please enter a valid name.',
  EMAIL_ALREADY_EXISTS_ERROR: 'Email already exists. Please choose a different email.',
  USER_REGISTRATION_ERRORS: 'An error occurred during registration. Please try again.',
};

export const USER_LOGIN_ERRORS: ErrorMessagesGroup = {
  INVALID_CREDENTIALS_ERROR: 'Invalid email or password. Please try again.',
  ACCOUNT_DISABLED_ERROR: 'Your account is disabled. Please contact support.',
  USER_NOT_FOUND_ERROR: 'User not found. Please check your credentials and try again.',
  TOO_MANY_FAILED_ATTEMPTS_ERROR: 'Too many failed login attempts. Please wait before trying again.',
};

export const USERNAME_UPDATE_ERRORS: ErrorMessagesGroup = {
  USERNAME_LENGTH_ERROR: 'Username must be between 3 and 20 characters',
  USERNAME_ALREADY_EXISTS_ERROR: 'Username already taken. Please choose a different username.',
  USERNAME_UPDATE_FAILED_ERROR: 'An error occurred while updating your username. Please try again.',
};

export const USER_ACCOUNT_ACTION_ERROR: ErrorMessagesGroup = {
  USER_ACCOUNT_UPDATE_FAILED_ERROR: 'An error occurred while updating your account. Please try again.',
  USER_ACCOUNT_DELETION_FAILED_ERROR: 'An error occurred while deleting your account. Please try again.',
  USER_ACCOUNT_ACTIVATION_FAILED_ERROR: 'An error occurred while activating your account. Please try again.',
  USER_ACCOUNT_VERIFICATION_FAILED_ERROR: 'An error occurred while verifying your account. Please try again.',
  USER_ACCOUNT_DEACTIVATION_FAILED_ERROR: 'An error occurred while deactivating your account. Please try again.',
  USER_ACCOUNT_REACTIVATION_FAILED_ERROR: 'An error occurred while reactivating your account. Please try again.',
};

export const USER_ROLE_ERRORS: ErrorMessagesGroup = {
  USER_ROLE_UPDATE_FAILED_ERROR: 'An error occurred while updating role. Please try again.',
};
