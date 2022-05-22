module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.test.ts?(x)"
  ],
  moduleDirectories: ["node_modules", "src"]
};
