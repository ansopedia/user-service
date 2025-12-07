/* eslint-disable sonarjs/no-os-command-from-path */
/* eslint-disable no-console */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Sets up the project by generating environment files and RSA keys
 */
const setupProject = () => {
  try {
    console.info("Starting project setup...");

    // Generate environment files
    console.info("Generating environment files...");
    execSync("tsx scripts/generate-env-files.ts", { stdio: "inherit" });

    // Generate RSA keys
    console.info("Generating RSA keys...");
    execSync("tsx scripts/generate-keys.ts", { stdio: "inherit" });

    // Update environment files with RSA keys
    console.info("Updating environment files with RSA keys...");
    updateEnvFilesWithRSAKeys();

    console.info("Project setup completed successfully!");
  } catch (error) {
    console.error(`Error during project setup: ${error}`);
    throw new Error(`Error during project setup: ${error}`);
  }
};

/**
 * Updates environment files with RSA keys
 */
const updateEnvFilesWithRSAKeys = () => {
  try {
    const keysDir = path.join(process.cwd(), "keys");
    const envDir = path.join(process.cwd(), "environments");

    // Check if keys directory exists
    if (!fs.existsSync(keysDir)) {
      console.error("Keys directory not found. Please generate keys first.");
      return;
    }

    // Read RSA keys
    const privateKeyPath = path.join(keysDir, "private.pem");
    const publicKeyPath = path.join(keysDir, "public.pem");

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
      console.error("RSA key files not found. Please generate keys first.");
      return;
    }

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");

    // Get all environment files
    const envFiles = fs.readdirSync(envDir).filter((file) => file.startsWith(".env."));

    // Update each environment file
    envFiles.forEach((envFile) => {
      const envFilePath = path.join(envDir, envFile);
      let envContent = fs.readFileSync(envFilePath, "utf8");

      // Replace private key placeholder
      envContent = envContent.replace(/PRIVATE_KEY=".*?"/s, `PRIVATE_KEY="${privateKey.replace(/\r?\n/g, "\n")}"`);

      // Replace public key placeholder
      envContent = envContent.replace(/PUBLIC_KEY=".*?"/s, `PUBLIC_KEY="${publicKey.replace(/\r?\n/g, "\n")}"`);

      // Write updated content back to file
      fs.writeFileSync(envFilePath, envContent);
      console.info(`Updated RSA keys in ${envFile}`);
    });
  } catch (error) {
    console.error(`Error updating environment files with RSA keys: ${error}`);
  }
};

// Execute the function
setupProject();
