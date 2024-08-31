import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  roots: ['<rootDir>'],
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
