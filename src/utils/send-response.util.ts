import { Response, request } from "express";
import { ZodIssue } from "zod";

import { ErrorCode, envConstants } from "@/constants";

import { errorLogger } from "./logger";

export interface SendResponse<T = undefined> {
  response: Response;
  code?: ErrorCode;
  statusCode: number;
  status?: "success" | "failed";
  message: string;
  errorDetails?: Error;
  data?: T;
  errors?: ZodIssue[];
}

// Define the type for response body including optional errorDetails
type ResponseBody<T> = {
  status: "success" | "failed";
  message: string;
  data?: T;
  code?: ErrorCode;
  errors?: ZodIssue[];
  errorDetails?: {
    name: string;
    message: string;
    stack?: string;
  };
};

export const sendResponse = <T>(responseData: SendResponse<T>) => {
  const { response, statusCode, message, errorDetails, status = "success", data, errors, code } = responseData;
  const isProduction = envConstants.NODE_ENV === "production";

  // Initialize response body with required fields
  const responseBody: ResponseBody<T> = { status, message, data, code, errors };

  if (!isProduction && errorDetails) {
    responseBody.errorDetails = errorDetails;
  }

  if (errorDetails && statusCode >= 500) {
    errorLogger.error(
      `Error occurred in ${request.url}: ${errorDetails.name} ${errorDetails.message} ${errorDetails.stack}`
    );
  }

  response.status(statusCode).json(responseBody);
};
