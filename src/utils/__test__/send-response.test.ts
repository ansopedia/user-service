import { type Response } from "express";

import { type SendResponse, sendResponse } from "@/utils";

describe("sendResponse", () => {
  it("should return a successful response with the correct data", () => {
    const mockResponse: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockData: SendResponse<{ someData: string }> = {
      response: mockResponse,
      statusCode: 200,
      message: "Success!",
      data: { someData: "Hello, World!" },
    };

    sendResponse(mockData);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Success!",
      data: { someData: "Hello, World!" },
      status: "success",
    });
  });

  it("should log an error in non-production environments", () => {
    const mockResponse: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockError: Error = new Error("Something went wrong");

    const mockData = {
      response: mockResponse,
      statusCode: 500,
      message: "Internal Server Error",
      errorDetails: mockError,
    };

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    sendResponse(mockData);

    expect(mockData.errorDetails).toStrictEqual(mockError);

    process.env.NODE_ENV = originalEnv;
  });
});
