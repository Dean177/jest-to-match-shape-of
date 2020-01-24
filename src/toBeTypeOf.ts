import * as getType from 'jest-get-type'
import { matcherHint, printExpected, printReceived } from  'jest-matcher-utils'
import { JestResult } from './common-types'
import MatcherUtils = jest.MatcherUtils

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeTypeOf(expected: any): R, // tslint:disable-line:no-any
    }
  }
}

export function toBeTypeOf <T>(this: MatcherUtils | void, received: T, expected: T): JestResult {
  const pass = getType(received) === getType(expected)

  return {
    message: () => pass ? '' :
      `${matcherHint('.toBeTypeOf')}\n` +
      `\n` +
      `Received:\n` +
      `  ${printReceived(getType(received))}\n` +
      `Expected:\n` +
      `  ${printExpected(getType(expected))}\n` +
      `For value:\n` +
      JSON.stringify(received, null, 2),
    pass,
  }
}
