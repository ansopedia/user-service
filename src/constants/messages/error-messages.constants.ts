interface ErrorMessagesGroup {
  [key: string]: string;
}

export const GENERAL_ERRORS: ErrorMessagesGroup = {
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred.',
  INVALID_REQUEST_ERROR: 'Invalid request format.',
  RESOURCE_NOT_FOUND_ERROR: 'Resource not found.',
  UNAUTHORIZED_ERROR: 'Unauthorized access.',
  FORBIDDEN_ERROR: 'Access forbidden.',
};

export const AUTHENTICATION_ERRORS: ErrorMessagesGroup = {
  INVALID_CREDENTIALS_ERROR: 'Invalid email or password.',
  ACCOUNT_DISABLED_ERROR: 'Account is disabled.',
  PASSWORD_RESET_REQUIRED_ERROR: 'Password reset required.',
};

export const USER_REGISTRATION_ERRORS: ErrorMessagesGroup = {
  EMAIL_ALREADY_EXISTS_ERROR: 'Email already in use.',
  USERNAME_ALREADY_EXISTS_ERROR: 'Username already taken.',
  WEAK_PASSWORD_ERROR: 'Password must be stronger.',
  INVALID_EMAIL_FORMAT_ERROR: 'Invalid email format.',
};

export const DATA_VALIDATION_ERRORS: ErrorMessagesGroup = {
  MISSING_REQUIRED_FIELD_ERROR: 'Please fill in all required fields.',
  INVALID_FIELD_VALUE_ERROR: 'Invalid value for field.',
};
