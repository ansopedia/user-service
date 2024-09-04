import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  transformIgnorePatterns: ['node_modules/(?!(jest-)?ts-jest)'],
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'], // Use setupFilesAfterEnv instead of setupFiles
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
