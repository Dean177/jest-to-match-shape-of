import chalk from 'chalk'
import { Result } from './common-types'

const { green, red } = chalk

// tslint:disable-next-line:no-any
export const toBeTypeOfCompare = (actual: any, expected: any): Result => {
  if (actual == null && expected != null) {
    return {
      message: `expected '${green(typeof expected)}' but got '${red(actual)}'`,
      pass: false,
    }
  }

  if (Array.isArray(expected)) {
    const hasPassed = Array.isArray(actual)
    return {
      message: (!hasPassed)
        ? `expected '${green('array')}', but was '${red(typeof actual)}'`
        : '',
      pass: hasPassed,
    }
  }

  const pass = typeof actual === typeof expected
  const message = (!pass) ?
    `expected '${green(typeof expected)}', but was '${red(typeof actual)}' for ${JSON.stringify(actual)}` :
    ''

  return { message, pass }
}
