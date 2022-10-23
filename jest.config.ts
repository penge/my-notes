import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.test.ts?(x)"
  ],
  moduleDirectories: ["node_modules", "src"]
};

export default config;
