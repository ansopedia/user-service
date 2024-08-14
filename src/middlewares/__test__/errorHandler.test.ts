import request from 'supertest';
import { app } from '@/server';
import { ErrorTypeEnum, getErrorObject } from '@/constants';

describe('errorHandler', () => {
  it('should handle general errors', async () => {
    const errorObj = getErrorObject(ErrorTypeEnum.enum.RESOURCE_NOT_FOUND);
    const res = await request(app).get('/');
    expect(res.status).toBe(errorObj.httpStatusCode);

    const { status, message, code } = res.body;
    expect(status).toBe('failed');
    expect(message).toBe(errorObj.body.message);
    expect(code).toBe(errorObj.body.code);
  });
});
