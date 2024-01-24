import { Request, Response } from 'express';
import { UserModel } from '../models/User';

import { GENERAL_ERRORS, USER_LOGIN_ERRORS, USER_REGISTRATION_ERRORS } from '../constants';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt-token';
const { INTERNAL_SERVER_ERROR } = GENERAL_ERRORS;

const { EMAIL_ALREADY_EXISTS_ERROR } = USER_REGISTRATION_ERRORS;
const { USER_NOT_FOUND_ERROR, INVALID_CREDENTIALS_ERROR, ACCOUNT_DISABLED_ERROR } = USER_LOGIN_ERRORS;

export class AuthController {
  static async createUserWithEmailAndPassword(req: Request, res: Response) {
    const { name, email, password } = req.body;
    try {
      const isUserExist = await UserModel.findOne({ email });
      if (isUserExist) {
        res.status(409).json({ message: EMAIL_ALREADY_EXISTS_ERROR });
        return;
      }

      const newUser = new UserModel({ name, email, password });
      await newUser.save();

      const refreshToken = generateRefreshToken({ _id: newUser._id });
      const accessToken = generateAccessToken({ _id: newUser._id });

      newUser.tokens.push({ accessToken });

      newUser.save();

      res.status(201).json({
        token: { refreshToken, accessToken },
      });
    } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR, error });
    }
  }

  static async signInWithEmailAndPassword(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const foundUser = await UserModel.findOne({ email });
      if (!foundUser) {
        res.status(404).json({ message: USER_NOT_FOUND_ERROR });
        return;
      }

      if (foundUser.password !== password) {
        res.status(401).json({ message: INVALID_CREDENTIALS_ERROR });
        return;
      }

      if (foundUser.isAccountDisabled === true) {
        res.status(401).json({ message: ACCOUNT_DISABLED_ERROR });
        return;
      }

      const refreshToken = generateRefreshToken({ _id: foundUser._id });
      const accessToken = generateAccessToken({ _id: foundUser._id });

      foundUser.tokens.push({ accessToken });

      foundUser.save();

      res.status(200).json({
        token: { refreshToken, accessToken },
      });
    } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR, error });
    }
  }
}
