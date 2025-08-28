import { type Response } from "express";
import { type ZodIssue } from "zod";

import { type ErrorCode } from "@/constants";

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
  errors: ZodIssue[];
}

export type SendResponse<T> = SendResponseSuccess<T> | SendResponseFailed;

interface IResponseBodySuccess<T> {
  status: "success";
  message: string;
  data?: T;
}

interface IResponseBodyFailed {
  status: "failed";
  message: string;
  code: string;
  errors?: ZodIssue[];
}

type IResponseBody<T> = IResponseBodySuccess<T> | IResponseBodyFailed;

export const sendResponse = <T>({ status = "success", message, response, statusCode, ...rest }: SendResponse<T>) => {
  let responseBody: IResponseBody<T>;

  if (status === "failed") {
    const { code, errors } = rest as SendResponseFailed;

    // Initialize response body based on status
    responseBody = {
      status,
      message,
      code,
    };

    if (errors.length) {
      responseBody.errors = errors;
    }
  } else {
    const { data } = rest as SendResponseSuccess<T>;

    // Initialize response body based on status
    responseBody = {
      status,
      message,
      data,
    };
  }

  response.status(statusCode).json(responseBody);
};
