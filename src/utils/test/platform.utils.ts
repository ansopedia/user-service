import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/platform/platform.constant.js";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";
import type { CreatePlatform, CreatePlatformInput, GetPlatform } from "@/types";

export const createPlatformRequest = async (
  platform: CreatePlatformInput,
  authorizationHeader: string
): Promise<Response> => {
  return supertest(app).post("/api/v1/platforms").send(platform).set("Authorization", authorizationHeader);
};

export const expectCreatePlatformSuccess = (response: Response, platform: CreatePlatformInput): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.PLATFORM_CREATED_SUCCESSFULLY,
    data: {
      platform: {
        id: expect.any(String),
        name: platform.name,
        slug: platform.slug,
        description: platform.description,
        logoUrl: platform.logoUrl,
        status: platform.status,
      },
    },
  });
};

export const getPlatformsRequest = async (authorizationHeader: string): Promise<Response> => {
  return supertest(app).get("/api/v1/platforms").set("Authorization", authorizationHeader);
};

export const expectGetPlatformsSuccess = (response: Response): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.PLATFORM_FETCHED_SUCCESSFULLY,
    data: {
      platforms: expect.any(Array),
    },
  });
};

export const getPlatformBySlugRequest = async (slug: string, authorizationHeader: string): Promise<Response> => {
  return supertest(app).get(`/api/v1/platforms/${slug}`).set("Authorization", authorizationHeader);
};

export const expectGetPlatformBySlugSuccess = (response: Response, expectedPlatform: Partial<GetPlatform>): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.PLATFORM_FETCHED_SUCCESSFULLY,
    data: {
      platform: {
        id: expect.any(String),
        ...expectedPlatform,
      },
    },
  });
};

export const updatePlatformRequest = async (
  slug: string,
  updateData: Partial<CreatePlatform>,
  authorizationHeader: string
): Promise<Response> => {
  return supertest(app).put(`/api/v1/platforms/${slug}`).send(updateData).set("Authorization", authorizationHeader);
};

export const expectUpdatePlatformSuccess = (response: Response, expectedPlatform: Partial<GetPlatform>): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.PLATFORM_UPDATED_SUCCESSFULLY,
    data: {
      platform: {
        id: expect.any(String),
        ...expectedPlatform,
      },
    },
  });
};

export const deletePlatformRequest = async (slug: string, authorizationHeader: string): Promise<Response> => {
  return supertest(app).delete(`/api/v1/platforms/${slug}`).set("Authorization", authorizationHeader);
};

export const expectDeletePlatformSuccess = (response: Response): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.PLATFORM_DELETED_SUCCESSFULLY,
    data: null,
  });
};
