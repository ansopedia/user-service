import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  roots: ['<rootDir>'],
  setupFiles: ['dotenv/config'],
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;
