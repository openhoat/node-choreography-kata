import type { Config as JestConfig } from 'jest'

const jestConfig: JestConfig = {
  preset: 'ts-jest',
  silent: true,
  testEnvironment: 'node',
}

export default jestConfig
