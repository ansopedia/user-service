import { check } from 'express-validator';

import { CONFIRM_PASSWORD_VALIDATION_ERRORS, EMAIL_VALIDATION_ERRORS, PASSWORD_VALIDATION_ERRORS } from '../constants';
const { EMAIL_INVALID_ERROR, EMAIL_EMPTY_ERROR } = EMAIL_VALIDATION_ERRORS;

const {
  PASSWORD_TOO_SHORT,
  PASSWORD_EMPTY_ERROR,
  PASSWORD_MISSING_NUMBER,
  PASSWORD_MISSING_LOWERCASE,
  PASSWORD_MISSING_UPPERCASE,
  PASSWORD_MISSING_CASE_VARIATION,
} = PASSWORD_VALIDATION_ERRORS;
const { CONFIRM_PASSWORD_EMPTY_ERROR, CONFIRM_PASSWORD_MISMATCH_ERROR } = CONFIRM_PASSWORD_VALIDATION_ERRORS;

export const validateEmail = () => [
  check('email').notEmpty().withMessage(EMAIL_EMPTY_ERROR).bail().trim().isEmail().withMessage(EMAIL_INVALID_ERROR),
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

export const validateSignUp = [...validateEmail(), ...validatePassword(), ...validateConfirmPassword()];
