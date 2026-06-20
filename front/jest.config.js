module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/src/test.ts'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};
