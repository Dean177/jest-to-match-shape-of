import chalk from 'chalk'
import { every, flatMap, flatten, head, isUndefined, keys as keysOf, map, repeat, some, uniq } from 'lodash'
import { Result, MatcherFactory } from './common-types'
import { toBeTypeOfCompare } from './toBeTypeOf'

const { green, red } = chalk

export const toMatchShapeOfCompare = <T>(actual: T, expected: T): Result =>
  toMatchOneOfCompare(actual, [expected])

export const toMatchShapeOf: MatcherFactory = () => ({
  compare: toMatchShapeOfCompare,
})

const successResult = { message: '', pass: true }

export const toMatchOneOfCompare = <T extends {}>(
  actual: T,
  expectedValues: Array<T>,
  keys: Array<string> = []
): Result => {
  if (Array.isArray(actual)) {
    if (actual.length === 0) {
      return successResult
    }

    const results = actual.map(cActual => toMatchOneOfCompare(cActual, expectedValues, keys))
    if (every(results, ({ pass }) => pass)) {
      return successResult
    } else {
      return {
        message: (head(results.filter(({ pass }) => !pass)) as Result).message,
        pass: false,
      }
    }
  }

  if (actual != null && typeof actual === 'object') {
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

    const results: Array<Result> = map(
      possibleValuesForKey,
      (values: Array<T[keyof T]>, key: keyof T): Result =>
        toMatchOneOfCompare(actual[key], values, [...keys, key]) as Result,
    ) as any // tslint:disable-line:no-any TODO ts things that results is a boolean array?

    return every(results, ({ pass }) => pass) ? successResult : {
      message: results.map(({ message }) => message).join(''),
      pass: false,
    }
  }

  const matcherResults = expectedValues.map(expected => toBeTypeOfCompare(actual, expected))
  if (some(matcherResults, ({ pass }) => pass)) {
    return successResult
  }

  const expectedTypes: Array<string> = expectedValues.map(expected => {
    if (expected != null && typeof expected === 'object') {
      return JSON.stringify(expected)
    } else if (expected === null) {
      return 'null'
    } else if (isUndefined(expected)) {
      return 'undefined'
    }

    return (typeof expected)
  })

  const typeMessage = (expectedTypes.length === 1)
    ? `to be ${green(expectedTypes[0])}`
    : `to be one of ${green(`[${expectedTypes.join(', ')}]`)}`

  const prefix = (keys.length === 0) ? 'E' : `${repeat('  ', keys.length)}For '${keys.join('.')}' e`

  return {
    message: `${prefix}xpected value: ${red(JSON.stringify(actual))} ${typeMessage}\n`,
    pass: false,
  }
}

export const toMatchOneOf: MatcherFactory = () => ({
  compare: toMatchOneOfCompare,
})
