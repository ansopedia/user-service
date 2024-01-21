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
