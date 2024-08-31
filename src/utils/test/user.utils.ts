import supertest, { Response } from 'supertest';
import { app } from '../../server';
import { STATUS_CODES } from '../../constants';

export async function retrieveUser(username: string): Promise<Response> {
  return supertest(app).get(`/api/v1/users/${username}`);
}

export function expectUserRetrievalSuccess(response: Response): void {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
}
