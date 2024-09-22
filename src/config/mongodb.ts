import mongoose from "mongoose";
import { envConstants, ErrorTypeEnum } from "@/constants";
import { logger } from "@/utils";

const { DATABASE_URL, NODE_ENV } = envConstants;

const dbOptions = {
  dbName: "users-service",
};

export const connectDB = async () => {
  try {
    if (NODE_ENV === "development") {
      mongoose.set("debug", true);
      await mongoose.connect(DATABASE_URL, dbOptions);
      return;
    }

    if (NODE_ENV === "test") {
      await mongoose.connect(DATABASE_URL, dbOptions);
      await mongoose.connection.db?.dropDatabase();
      return;
    }

    if (NODE_ENV === "production") {
      await mongoose.connect(DATABASE_URL, dbOptions);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.error(error);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};
