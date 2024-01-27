import { check } from 'express-validator';

import {
  EMAIL_EMPTY_ERROR,
  PASSWORD_TOO_SHORT,
  EMAIL_INVALID_ERROR,
  PASSWORD_EMPTY_ERROR,
  PASSWORD_MISSING_NUMBER,
  PASSWORD_MISSING_UPPERCASE,
  PASSWORD_MISSING_LOWERCASE,
  CONFIRM_PASSWORD_EMPTY_ERROR,
  CONFIRM_PASSWORD_MISMATCH_ERROR,
  PASSWORD_MISSING_CASE_VARIATION,
  // MISSING_REQUIRED_FIELD_ERROR,
} from '../../constants';

export const validateEmail = () => [
  check('email')
    .notEmpty()
    .withMessage(EMAIL_EMPTY_ERROR)
    .bail()
    .trim()
    .isEmail()
    .withMessage(EMAIL_INVALID_ERROR),
];

export const validatePassword = () => [
  check('password')
    .notEmpty()
    .withMessage(PASSWORD_EMPTY_ERROR)
    .bail()
    .trim()
    .isLength({ min: 8 })
    .withMessage(PASSWORD_TOO_SHORT)
    .bail()
    .matches(/\d/)
    .withMessage(PASSWORD_MISSING_NUMBER)
    .bail()
    .matches(/[a-zA-Z]/)
    .withMessage(PASSWORD_MISSING_CASE_VARIATION)
    .bail()
    .matches(/[a-z]/)
    .withMessage(PASSWORD_MISSING_LOWERCASE)
    .bail()
    .matches(/[A-Z]/)
    .withMessage(PASSWORD_MISSING_UPPERCASE),
];

export const validateConfirmPassword = () => [
  check('confirmPassword')
    .notEmpty()
    .withMessage(CONFIRM_PASSWORD_EMPTY_ERROR)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(CONFIRM_PASSWORD_MISMATCH_ERROR);
      }
      return true;
    }),
];

export const validateUserStatusFields = [
  check('isAccountVerified').custom((_, { req }) => {
    // Check if at least one of the fields is present
    if (
      req.body.isAccountVerified === undefined &&
      req.body.isAccountDisabled === undefined &&
      req.body.isProfileComplete === undefined
    ) {
      throw new Error(
        'At least one of isAccountVerified, isAccountDisabled, or isProfileComplete must be present',
      );
    }
    return true;
  }),
  check('isAccountVerified')
    .optional()
    .trim()
    .isBoolean()
    .withMessage('Invalid value for isAccountVerified'),
  check('isAccountDisabled')
    .optional()
    .trim()
    .isBoolean()
    .withMessage('Invalid value for isAccountDisabled'),
  check('isProfileComplete')
    .optional()
    .trim()
    .isBoolean()
    .withMessage('Invalid value for isProfileComplete'),
];

export const validateSignUp = [
  ...validateEmail(),
  ...validatePassword(),
  ...validateConfirmPassword(),
];
export const validateSignIn = [...validateEmail(), ...validatePassword()];
