import * as util from 'jest-matcher-utils'
import * as getType from 'jest-get-type'
import { printExpected, printReceived } from  'jest-matcher-utils'
import { JestResult } from './common-types'
import MatcherUtils = jest.MatcherUtils

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeTypeOf(expected: any): R, // tslint:disable-line:no-any
    }
  }
}

export function toBeTypeOf <T>(this: MatcherUtils, actual: T, expected: T): JestResult {
  const pass = getType(actual) === getType(expected)

  return {
    message: () => pass ? '' :
      util.matcherHint('.toBeTypeOf') +
      '\n\n' +
      `Received:\n` +
      `  ${printReceived(getType(actual))}\n` +
      `Expected:\n` +
      `  ${printExpected(getType(expected))}\n` +
      `For value:\n` +
      JSON.stringify(actual, null, 2),
    pass,
  }
}
