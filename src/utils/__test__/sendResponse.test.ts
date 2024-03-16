import { Response } from 'express';
import { SendResponse, sendResponse } from '../sendResponse.util';

describe('sendResponse', () => {
  it('should return a successful response with the correct payload', () => {
    const mockResponse: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockData: SendResponse<{ someData: string }> = {
      response: mockResponse,
      statusCode: 200,
      message: 'Success!',
      payload: { someData: 'Hello, World!' },
    };

    sendResponse(mockData);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Success!',
      someData: 'Hello, World!',
      status: 'success',
    });
  });

  it('should log an error in non-production environments', () => {
    const mockResponse: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockError: Error = new Error('Something went wrong');

    const mockData: SendResponse = {
      response: mockResponse,
      statusCode: 500,
      message: 'Internal Server Error',
      errorDetails: mockError,
    };

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    sendResponse(mockData);

    expect(mockData.errorDetails).toStrictEqual(mockError);

    process.env.NODE_ENV = originalEnv;
  });
});
