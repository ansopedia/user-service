import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  roots: ['<rootDir>'],
  setupFiles: ['dotenv/config'],
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/config/setup-after-env.ts'],
};

export default config;
