// General errors
export const TIMEOUT_ERROR = 'Request timed out. Please try again later.';
export const INTERNAL_SERVER_ERROR = 'An unexpected error occurred. Please try again later.';
export const NETWORK_ERROR = 'Network error occurred. Please check your internet connection.';
export const INVALID_REQUEST_FORMAT = 'Invalid request format. Please check your request data.';
export const RESOURCE_NOT_FOUND_ERROR = 'Resource not found. Please verify the URL and try again.';
export const FORBIDDEN_ERROR = 'Access forbidden. You do not have permission to access this resource.';

// Authentication errors
export const AUTHENTICATION_TOKEN_MISSING_ERROR = 'Authentication token missing. Please log in to continue.';
export const TOKEN_EXPIRED_ERROR = 'Your session has expired. Please log in again to continue.';
export const PASSWORD_RESET_REQUIRED_ERROR = 'Password reset required. Please check your email for instructions.';
export const TOKEN_INVALID_ERROR = 'The authentication token is either invalid or has been tampered with. Please try logging in again.';
export const REFRESH_TOKEN_MISSING_ERROR = 'Refresh token missing. Please log in to continue.';

// Authentication errors
export const UNAUTHORIZED_ERROR = 'Unauthorized access. Please ensure you are logged in.';
export const INSUFFICIENT_PERMISSIONS_ERROR = 'You do not have sufficient permissions to perform this action.';

// Validation errors
export const MISSING_REQUIRED_FIELD_ERROR = 'Please fill in all required fields.';
export const INVALID_DATE_FORMAT_ERROR = 'Invalid date format. Please enter a valid date.';
export const INVALID_PHONE_NUMBER_ERROR = 'Invalid phone number format. Please enter a valid phone number.';

// Validation errors
export const EMAIL_EMPTY_ERROR = 'Email is required. Please enter your email address.';
export const EMAIL_INVALID_ERROR = 'Invalid email format. Please enter a valid email address.';

// Password validation errors
export const PASSWORD_EMPTY_ERROR = 'Password is required. Please enter your password.';
export const PASSWORD_TOO_SHORT = 'Password must be at least 8 characters long.';
export const PASSWORD_MISSING_NUMBER = 'Password must contain at least 1 number.';
export const PASSWORD_MISSING_LOWERCASE = 'Password must contain at least 1 lowercase letter.';
export const PASSWORD_MISSING_UPPERCASE = 'Password must contain at least 1 uppercase letter.';
export const PASSWORD_MISSING_CASE_VARIATION = 'Password must contain at least 1 uppercase letter and 1 lowercase letter.';

// Password confirmation validation errors
export const CONFIRM_PASSWORD_EMPTY_ERROR= 'Confirm password is required. Please confirm your password.';
export const CONFIRM_PASSWORD_MISMATCH_ERROR= 'Passwords do not match. Please ensure both passwords are identical.';

// Password reset errors
export const INVALID_PASSWORD_RESET_TOKEN_ERROR = 'Invalid password reset token. Please check your email and try again.';
export const PASSWORD_RESET_TOKEN_EXPIRED_ERROR = 'Password reset token has expired. Please check your email and try again.';

// Password update errors
export const INVALID_CURRENT_PASSWORD_ERROR= 'Invalid current password. Please try again.';
export const PASSWORD_UPDATE_FAILED_ERROR=  'An error occurred while updating your password. Please try again.';

// Email update errors
export const EMAIL_ALREADY_EXISTS_ERROR = 'Email already exists. Please choose a different email.';
export const EMAIL_UPDATE_FAILED_ERROR = 'An error occurred while updating your email. Please try again.';

// User registration errors
export const INVALID_NAME_ERROR = 'Invalid name. Please enter a valid name.';
export const USER_REGISTRATION_ERRORS = 'An error occurred during registration. Please try again.';

// User login errors
export const INVALID_CREDENTIALS_ERROR= 'Invalid email or password. Please try again.';
export const ACCOUNT_DISABLED_ERROR= 'Your account is disabled. Please contact support.';
export const USER_NOT_FOUND_ERROR= 'User not found. Please check your credentials and try again.';
export const TOO_MANY_FAILED_ATTEMPTS_ERROR= 'Too many failed login attempts. Please wait before trying again.';

// Username update errors
export const USERNAME_LENGTH_ERROR= 'Username must be between 3 and 20 characters';
export const USERNAME_ALREADY_EXISTS_ERROR = 'Username already taken. Please choose a different username.';
export const USERNAME_UPDATE_FAILED_ERROR = 'An error occurred while updating your username. Please try again.';

// User account errors
export const USER_ACCOUNT_UPDATE_FAILED_ERROR = 'An error occurred while updating your account. Please try again.';
export const USER_ACCOUNT_DELETION_FAILED_ERROR = 'An error occurred while deleting your account. Please try again.';
export const USER_ACCOUNT_ACTIVATION_FAILED_ERROR = 'An error occurred while activating your account. Please try again.';
export const USER_ACCOUNT_VERIFICATION_FAILED_ERROR = 'An error occurred while verifying your account. Please try again.';
export const USER_ACCOUNT_DEACTIVATION_FAILED_ERROR = 'An error occurred while deactivating your account. Please try again.';
export const USER_ACCOUNT_REACTIVATION_FAILED_ERROR = 'An error occurred while reactivating your account. Please try again.';

// User role errors
export const USER_ROLE_UPDATE_FAILED_ERROR = 'An error occurred while updating role. Please try again.';
