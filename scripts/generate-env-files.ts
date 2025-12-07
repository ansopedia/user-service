/* eslint-disable no-console */
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ENVIRONMENTS = ["test", "development", "local"];
const ENV_EXAMPLE_PATH = path.join(__dirname, "..", ".env.example");
const ENV_DIR = path.join(__dirname, "..", "environments");

/**
 * Creates the environments directory if it doesn't exist
 */
const createEnvironmentsDir = () => {
  if (!fs.existsSync(ENV_DIR)) {
    fs.mkdirSync(ENV_DIR, { recursive: true });
    console.info(`Created environments directory at ${ENV_DIR}`);
  }
};

/**
 * Generates environment files for specified environments
 */
const generateEnvFiles = () => {
  try {
    // Create environments directory if it doesn't exist
    createEnvironmentsDir();

    // Read the example env file
    const exampleEnvContent = fs.readFileSync(ENV_EXAMPLE_PATH, "utf8");

    // Generate env files for each environment
    ENVIRONMENTS.forEach((env) => {
      const envFilePath = path.join(ENV_DIR, `.env.${env}`);

      // Skip if file already exists
      if (fs.existsSync(envFilePath)) {
        console.info(`Environment file ${envFilePath} already exists. Skipping.`);
        return;
      }

      // Create the env file with the example content
      fs.writeFileSync(envFilePath, exampleEnvContent);
      console.info(`Generated environment file: ${envFilePath}`);
    });

    console.info("Environment files generation completed successfully!");
  } catch (error) {
    console.error(`Error generating environment files: ${error}`);
    throw new Error(`Error generating environment files: ${error}`);
  }
};

// Execute the function
generateEnvFiles();
