import request from 'supertest';
import { app } from '../../server';

describe('Signup', () => {
  it('should return 422 if the email is not valid', async () => {
    await request(app).post('/api/v1/auth/signup').send({}).expect(422);
    await request(app).post('/api/v1/auth/signup').send({ email: 'invalidEmail' }).expect(422);
  });
});
