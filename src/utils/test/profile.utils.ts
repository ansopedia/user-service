import supertest, { Response } from 'supertest';
import { CreateProfileData, ProfileData, success } from '@/api/v1/profile';
import { app } from '@/app';
import { STATUS_CODES } from '@/constants';

export const upSertProfileData = async (payload: CreateProfileData, authorizationHeader: string) => {
  return await supertest(app).put('/api/v1/profile').set('authorization', authorizationHeader).send(payload);
};

export const expectProfileData = (response: Response, payload: ProfileData) => {
  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.OK);

  const expectedBody: Partial<ProfileData> & { message: string; status: string } = {
    message: success.PROFILE_UPDATED_SUCCESSFULLY,
    status: 'success',
    userId: payload.userId,
  };

  if (payload.avatar != null) expectedBody.avatar = payload.avatar;
  if (payload.bio != null) expectedBody.bio = payload.bio;
  if (payload.phoneNumber != null) expectedBody.phoneNumber = payload.phoneNumber;
  if (payload.address) expectedBody.address = payload.address;
  if (payload.socialLinks) expectedBody.socialLinks = payload.socialLinks;

  expect(response.body).toMatchObject(expectedBody);
};
