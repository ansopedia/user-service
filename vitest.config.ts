import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enable global test APIs.
    globals: true,
    // Specify the test environment.
    environment: "node",
    // Set a timeout for tests.
    testTimeout: 10000,
    // Exclude certain directories from test discovery.
    exclude: ["**/dist/**", "**/node_modules/**"],
    // Tell Vitest to run tests on the source TypeScript files directly.
    include: ["src/**/*.test.ts", "src/__test__/*.test.ts"],
    // Specify the setup file for global setup/teardown.
    setupFiles: ["./src/vitest.setup.ts"],
  },
  resolve: {
    // This is the crucial part that links your tsconfig.json paths to Vitest.
    // We are mapping the "@/" alias to your project's `src` directory.
    alias: {
      "@/constants": path.resolve(__dirname, "./src/constants/index.ts"),
      "@/server": path.resolve(__dirname, "./src/server.ts"),
      "@/app": path.resolve(__dirname, "./src/app.ts"),
      "@/types": path.resolve(__dirname, "./src/types/index.ts"),
      "@/routes": path.resolve(__dirname, "./src/routes/index.ts"),
      "@/config": path.resolve(__dirname, "./src/config/index.ts"),
      "@/utils/test": path.resolve(__dirname, "./src/utils/test/index.ts"),
      "@/utils": path.resolve(__dirname, "./src/utils/index.ts"),
      "@/api": path.resolve(__dirname, "./src/api"),
      "@/middlewares": path.resolve(__dirname, "./src/middlewares/index.ts"),
      "@/services": path.resolve(__dirname, "./src/services/index.ts"),
    },
  },
});
