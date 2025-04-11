import mongoose, { ConnectOptions } from "mongoose";

import { ErrorTypeEnum, envConstants } from "@/constants";
import { logger } from "@/utils";

const { DATABASE_URL, NODE_ENV, DB_NAME, TEST_DB_NAME, TEST_DATABASE_URL } = envConstants;

const dbOptions: ConnectOptions = {
  dbName: NODE_ENV === "development" ? DB_NAME : TEST_DB_NAME,
};

export const connectDB = async () => {
  try {
    if (NODE_ENV === "development") {
      mongoose.set("debug", true);
      await mongoose.connect(DATABASE_URL, dbOptions);
      return;
    }

    if (NODE_ENV === "test") {
      await mongoose.connect(TEST_DATABASE_URL, dbOptions);
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
