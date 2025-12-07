import mongoose, { type ConnectOptions } from "mongoose";

import { ErrorTypeEnum, envConstants } from "@/constants";
import { errorLogger } from "@/utils";

const { DATABASE_URI, NODE_ENV, DB_NAME } = envConstants;

// Generate unique database name for test environment to avoid conflicts
const getTestDatabaseName = () => {
  if (NODE_ENV === "test") {
    // Use timestamp and random number for uniqueness
    return `${DB_NAME}_test_${crypto.randomUUID()}`;
  }
  return DB_NAME;
};

const dbOptions: ConnectOptions = {
  dbName: getTestDatabaseName(),
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
    // Drop the database in test environment for complete cleanup
    if (NODE_ENV === "test" && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    await mongoose.connection.close();
  } catch (error) {
    errorLogger.error(error);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};
