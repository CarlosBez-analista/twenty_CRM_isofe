import type { Config } from 'jest';

const config: Config = {
  displayName: 'nattivus-sdk',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/test/**/*.spec.ts',
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.esm.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: '../../coverage/nattivus-sdk',
};

export default config;
