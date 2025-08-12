import mongoose, { ConnectOptions } from "mongoose";

import { ErrorTypeEnum, envConstants } from "@/constants";
import { errorLogger } from "@/utils";

const { DATABASE_URI, NODE_ENV, DB_NAME } = envConstants;

const dbOptions: ConnectOptions = {
  dbName: DB_NAME,
};

export const connectDB = async () => {
  try {
    if (NODE_ENV === "development" || NODE_ENV === "local") {
      mongoose.set("debug", true);
      await mongoose.connect(DATABASE_URI, dbOptions);
      return;
    }

    if (NODE_ENV === "test") {
      await mongoose.connect(DATABASE_URI, dbOptions);
      await mongoose.connection.db?.dropDatabase();
      return;
    }

    if (NODE_ENV === "production") {
      await mongoose.connect(DATABASE_URI, dbOptions);
    }
  } catch (error) {
    errorLogger.error(error);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    errorLogger.error(error);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};
