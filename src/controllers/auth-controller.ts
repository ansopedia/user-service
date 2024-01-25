import { Request, Response } from 'express';
import { UserModel } from '../models/User';

import {
  GENERAL_ERRORS,
  USER_LOGIN_ERRORS,
  USER_REGISTRATION_ERRORS,
} from '../constants';
import { generateAndStoreAuthTokens } from '../utils/jwt-token';
import { sendApiResponse } from '../utils/sendApiResponse';
const { INTERNAL_SERVER_ERROR } = GENERAL_ERRORS;

const { EMAIL_ALREADY_EXISTS_ERROR } = USER_REGISTRATION_ERRORS;
const {
  USER_NOT_FOUND_ERROR,
  INVALID_CREDENTIALS_ERROR,
  ACCOUNT_DISABLED_ERROR,
} = USER_LOGIN_ERRORS;

export class AuthController {
  static async createUserWithEmailAndPassword(
    req: Request,
    response: Response,
  ) {
    const { name, email, password } = req.body;
    try {
      const isUserExist = await UserModel.findOne({ email });
      if (isUserExist) {
        sendApiResponse({
          response,
          statusCode: 409,
          message: EMAIL_ALREADY_EXISTS_ERROR,
        });
        return;
      }

      const user = new UserModel({ name, email, password });
      const tokens = generateAndStoreAuthTokens(user);
      await user.save();

      // res.status(201).json({ tokens });
      sendApiResponse({
        response,
        statusCode: 201,
        message: 'User created successfully',
        payload: { tokens },
      });
    } catch (error) {
      sendApiResponse({
        response,
        statusCode: 500,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }

  static async signInWithEmailAndPassword(req: Request, response: Response) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        sendApiResponse({
          response,
          statusCode: 404,
          message: USER_NOT_FOUND_ERROR,
        });
        return;
      }

      const { password: savedPassword, isAccountDisabled } = user;

      if (savedPassword !== password) {
        sendApiResponse({
          response,
          statusCode: 401,
          message: INVALID_CREDENTIALS_ERROR,
        });
        return;
      }

      if (isAccountDisabled) {
        sendApiResponse({
          response,
          statusCode: 401,
          message: ACCOUNT_DISABLED_ERROR,
        });
        return;
      }

      const tokens = generateAndStoreAuthTokens(user);
      await user.save();

      response.status(200).json({ tokens });
    } catch (error) {
      sendApiResponse({
        response,
        statusCode: 500,
        message: INTERNAL_SERVER_ERROR,
        errors: error as Error,
      });
    }
  }
}
