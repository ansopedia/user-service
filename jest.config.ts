import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  testTimeout: 10000,
  modulePathIgnorePatterns: ["<rootDir>/build"],
  transformIgnorePatterns: ["node_modules/(?!(jest-)?ts-jest)"],
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
