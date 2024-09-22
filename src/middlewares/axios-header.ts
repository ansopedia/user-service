import axios from "axios";
import { NextFunction, Request, Response } from "express";

import { getServerURL } from "@/utils";

export const addAxiosHeadersMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const serverURL = getServerURL(req);

  // Modify Axios instance or create a new one with pre-configured headers
  axios.defaults.headers.common["Origin"] = serverURL;

  next();
};
