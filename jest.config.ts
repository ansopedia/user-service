import type { Config } from "jest";
import type { JestConfigWithTsJest } from "ts-jest";
import { ESM_TS_TRANSFORM_PATTERN, TS_EXT_TO_TREAT_AS_ESM } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  testTimeout: 10000,
  transform: {
    [ESM_TS_TRANSFORM_PATTERN]: [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [...TS_EXT_TO_TREAT_AS_ESM],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], //TODO fix this
} satisfies Config;

export default config;
