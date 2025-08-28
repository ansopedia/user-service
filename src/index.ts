import { connectDB } from "@/config";
import { envConstants } from "@/constants";
import { errorLogger } from "@/utils";

import { startServer } from "./server.js";
import { initGeoDB } from "./utils/geo.js";

(async () => {
  try {
    await connectDB();
    await initGeoDB();
    await startServer(envConstants.APP_PORT);
  } catch (error) {
    errorLogger.error(`Failed to setup initial data: ${error}`);
    process.exit(1);
  }
})();
