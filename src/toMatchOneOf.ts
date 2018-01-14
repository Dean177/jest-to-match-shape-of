import { every, flatMap, flatten, head, isUndefined, keys as keysOf, map, some, uniq } from 'lodash'
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

export const formatError = (received: any, expectedTypes: Array<string>, keys: Array<string>): string => (
  util.matcherHint('.toMatchShapeOf') +
  '\n\n' +
  `Received${(keys.length === 0) ? '' : ' received.' + keys.join('.')}:\n` +
  `  ${util.printReceived(JSON.stringify(received))}\n` +
  `Expected${(expectedTypes.length === 1) ? '' : ' one of'}:\n` +
  `  ${util.printExpected(`[${expectedTypes.join(', ')}]`)}\n`
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

    const results = received.map(cActual => toMatchOneOf.bind(this)(cActual, expectedValues, keys))
    if (every(results, ({ pass }) => pass)) {
      return successResult
    } else {
      return {
        message: (head(results.filter(({ pass }) => !pass)) as JestResult).message,
        pass: false,
      }
    }
  }

  if (received != null && typeof received === 'object') {
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
        toMatchOneOf.bind(this)(received[key], values, [...keys, key]) as JestResult,
    ) as any // tslint:disable-line:no-any TODO ts thinks that results is a boolean array?

    return every(results, ({ pass }) => pass) ? successResult : {
      message: () => results.map(({ message }) => message).join(''),
      pass: false,
    }
  }

  const matcherResults = expectedValues.map(expected => toBeTypeOf.bind(this)(received, expected))
  if (some(matcherResults, ({ pass }) => pass)) {
    return successResult
  }


  const expectedTypes: Array<string> = expectedValues.map(expected => {
    // TODO replace this with the jest util?
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
