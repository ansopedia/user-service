import type { CreateProfileData, ProfileData } from "@ansospace/types";
import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/profile/index.js";
import { ROUTES, STATUS_CODES } from "@/constants";

import { app } from "../../app.js";

export const upSertProfileData = async (data: CreateProfileData, authorizationHeader: string) => {
  return await supertest(app)
    .put(`${ROUTES.API_ROOT}${ROUTES.PROFILE.ROOT}`)
    .set("authorization", authorizationHeader)
    .send(data);
};

export const expectProfileData = (response: Response, data: ProfileData) => {
  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.PROFILE_UPDATED_SUCCESSFULLY);
  expect(response.body.status).toBe("success");

  const expectedBody: Partial<ProfileData> = {
    userId: data.userId,
  };

  if (data.avatar != null) expectedBody.avatar = data.avatar;
  if (data.bio != null) expectedBody.bio = data.bio;
  if (data.name != null) expectedBody.name = data.name;
  if (data.givenName != null) expectedBody.givenName = data.givenName;
  if (data.familyName != null) expectedBody.familyName = data.familyName;
  if (data.phoneNumber != null) expectedBody.phoneNumber = data.phoneNumber;
  if (data.address) expectedBody.address = data.address;
  if (data.socialLinks) expectedBody.socialLinks = data.socialLinks;

  expect(response.body.data).toMatchObject(expectedBody);
};

export const toggleProfileVisibility = async (isPublic: boolean, authorizationHeader: string) => {
  return await supertest(app)
    .patch(`${ROUTES.API_ROOT}${ROUTES.PROFILE.VISIBILITY}`)
    .set("authorization", authorizationHeader)
    .send({ isPublic });
};

export const expectProfileVisibility = (response: Response, isPublic: boolean) => {
  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.PROFILE_VISIBILITY_UPDATED_SUCCESSFULLY);
  expect(response.body.status).toBe("success");

  expect(response.body.data.isPublic).toBe(isPublic);
};

export const getProfileData = async (authorizationHeader: string) => {
  return await supertest(app).get(`${ROUTES.API_ROOT}${ROUTES.PROFILE.ROOT}`).set("authorization", authorizationHeader);
};

export const expectGetProfileData = (response: Response, data: ProfileData) => {
  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.PROFILE_FETCHED_SUCCESSFULLY);
  expect(response.body.status).toBe("success");

  expect(response.body.data).toMatchObject(data);
};
