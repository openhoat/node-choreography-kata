import type { Config as JestConfig } from 'jest'

const config: JestConfig = {
  preset: 'ts-jest',
  silent: true,
  testEnvironment: 'node',
}

export default config
