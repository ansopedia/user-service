import supertest, { Response } from "supertest";

import { CreateProfileData, ProfileData, success } from "@/api/v1/profile";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

export const upSertProfileData = async (data: CreateProfileData, authorizationHeader: string) => {
  return await supertest(app).put("/api/v1/profile").set("authorization", authorizationHeader).send(data);
};

export const expectProfileData = (response: Response, data: ProfileData) => {
  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.PROFILE_UPDATED_SUCCESSFULLY);
  expect(response.body.status).toBe("success");

  const expectedBody: Partial<ProfileData> & {} = {
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
