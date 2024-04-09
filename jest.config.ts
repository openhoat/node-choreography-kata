import type { Config as JestConfig } from 'jest'

const config: JestConfig = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  silent: false,
}

export default config
