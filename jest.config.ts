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
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
