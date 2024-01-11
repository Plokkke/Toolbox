module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageReporters: ['lcov', 'text-summary', 'html-spa'],
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 94,
      functions: 92,
      lines: 99,
      statements: -100,
    },
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 500,
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  moduleNameMapper: {
    '^@/([^/]*)(|/.*)$': '<rootDir>/src/$1',
  },
};
