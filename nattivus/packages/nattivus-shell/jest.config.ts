import type { Config } from 'jest';

const config: Config = {
  displayName: 'nattivus-shell',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/test/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^@nattivus/shared$': '<rootDir>/../nattivus-shared/src/index.ts',
    '^@nattivus/sdk$': '<rootDir>/../nattivus-sdk/src/index.ts',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.ts',
  ],
  coverageDirectory: '../../coverage/nattivus-shell',
  coverageThresholds: {
    // Mínimo para Fase 3 services — será aumentado progressivamente
    global: { statements: 60, branches: 50, functions: 60, lines: 60 },
  },
  globalSetup: './test/global-setup.ts',
  globalTeardown: './test/global-teardown.ts',
  setupFilesAfterFramework: ['./test/setup.ts'],
};

export default config;
