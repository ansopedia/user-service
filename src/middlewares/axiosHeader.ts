import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { getServerURL } from '../utils/helper.util';

export const addAxiosHeadersMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const serverURL = getServerURL(req);

  // Modify Axios instance or create a new one with pre-configured headers
  axios.defaults.headers.common['Origin'] = serverURL;

  next();
};
