import {
  Email,
  MongooseObjectId,
  Username,
  mongooseObjectId,
  username as usernameSchema,
  email as validEmail,
} from "@/types";

export const validateObjectId = (objectId: unknown): MongooseObjectId => {
  return mongooseObjectId.parse(objectId);
};

export const validateUsername = (username: unknown): Username => {
  return usernameSchema.parse(username);
};

export const validateEmail = (email: string): Email => {
  return validEmail.parse(email);
};
