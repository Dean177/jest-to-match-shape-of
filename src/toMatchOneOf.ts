import { every, find, flatMap, flatten, head, isUndefined, keys as keysOf, map, some, uniq } from 'lodash'
import * as getType from 'jest-get-type'
import * as util from 'jest-matcher-utils'
import { JestResult } from './common-types'
import { toBeTypeOf } from './toBeTypeOf'
import MatcherUtils = jest.MatcherUtils

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchOneOf(expected: Array<any>): R, // tslint:disable-line:no-any
    }
  }
}

const successResult = {
  message: () => '',
  pass: true,
}

// tslint:disable-next-line:no-any
export const formatError = (received: any, expectedTypes: Array<string>, keys: Array<string>): string => (
  `${util.matcherHint('.toMatchShapeOf')}\n` +
  `\n` +
  `For${(keys.length === 0) ? '' : ' received' + keys.join('')}:\n` +
  `  type: ${util.RECEIVED_COLOR(getType(received))}\n` +
  `  value: ${util.printReceived(received)}\n` +
  `Expected type to be one of\n` +
  `  ${util.EXPECTED_COLOR(`${expectedTypes.join(', ')}`)}\n`
)

export function toMatchOneOf<T extends {}>(
  this: MatcherUtils | void,
  received: T,
  expectedValues: Array<T>,
  keys: Array<string> = [],
): JestResult {
  if (Array.isArray(received)) {
    if (received.length === 0) {
      return successResult
    }

    const results = received.map((cActual, index) =>
      toMatchOneOf.bind(this)(cActual, expectedValues, [...keys, `[${index}]`])
    )
    if (every(results, ({ pass }) => pass)) {
      return successResult
    } else {
      return {
        message: (head(results.filter(({ pass }) => !pass)) as JestResult).message,
        pass: false,
      }
    }
  }

  if (
    received != null &&
    typeof received === 'object' &&
    some(expectedValues, (expectedValue) => expectedValue != null && typeof expectedValue === 'object')
  ) {
    const validKeys: Array<keyof T> = uniq(flatMap(expectedValues, keysOf as (val: T) => Array<keyof T>))
    const possibleValuesForKey = validKeys.reduce(
      (acc: { [Key in keyof T]: Array<T[Key]> }, key: keyof T) => {
        acc[key] = flatten(
          expectedValues
            .filter(expected => !isUndefined(expected))
            .map(e => e && e[key])
        )
        return acc
      },
      {} as { [Key in keyof T]: Array<T[Key]> },
    )

    const results: Array<JestResult> = map(
      possibleValuesForKey,
      (values: Array<T[keyof T]>, key: keyof T): JestResult =>
        (toMatchOneOf.bind(this)(received[key], values, [...keys, `.${key}`])),
    ) as any // tslint:disable-line:no-any TODO ts thinks that results is a boolean array?

    const failedResult = find(results, result => !result.pass)

    return failedResult == null ? successResult : failedResult
  }

  const matcherResults = expectedValues.map(expected => toBeTypeOf.bind(this)(received, expected))
  if (some(matcherResults, ({ pass }) => pass)) {
    return successResult
  }

  const expectedTypes: Array<string> = expectedValues.map(expected => {
    // TODO replace this with the jest getType util?
    if (expected != null && typeof expected === 'object') {
      return JSON.stringify(expected)
    } else if (expected === null) {
      return 'null'
    } else if (isUndefined(expected)) {
      return 'undefined'
    }

    return (typeof expected)
  })

  return {
    message: () => formatError(received, expectedTypes, keys),
    pass: false,
  }
}
