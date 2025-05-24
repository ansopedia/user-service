import { Response } from "express";
import { ZodIssue } from "zod";

import { ErrorCode, envConstants } from "@/constants";

export interface SendResponseSuccess<T> {
  response: Response;
  statusCode: number;
  status?: "success";
  message: string;
  data?: T;
}

export interface SendResponseFailed {
  response: Response;
  statusCode: number;
  status: "failed";
  message: string;
  code: ErrorCode;
  errors?: ZodIssue[];
  errorDetails?: Error;
}

export type SendResponse<T> = SendResponseSuccess<T> | SendResponseFailed;

interface IResponseBodySuccess<T> {
  status: "success";
  message: string;
  data: T;
}

interface IResponseBodyFailed {
  status: "failed";
  message: string;
  code: string;
  errors?: ZodIssue[];
  errorDetails?: {
    name: string;
    message: string;
    stack?: string;
  };
}

type IResponseBody<T> = IResponseBodySuccess<T> | IResponseBodyFailed;

export const sendResponse = <T>({ status = "success", message, response, statusCode, ...rest }: SendResponse<T>) => {
  const isProduction = envConstants.NODE_ENV === "production";
  let responseBody: IResponseBody<T>;

  if (status === "failed") {
    const { errorDetails, code, errors } = rest as SendResponseFailed;

    // Initialize response body based on status
    responseBody = {
      status,
      message,
      code,
      errors,
    };

    // Add error details only in non-production environment
    if (!isProduction && errorDetails && status === "failed") {
      responseBody.errorDetails = errorDetails;
    }
  } else {
    const { data } = rest as SendResponseSuccess<T>;

    // Initialize response body based on status
    responseBody = {
      status,
      message,
      data: data as T,
    };
  }

  response.status(statusCode).json(responseBody);
};
