import { JestResult } from './common-types'
import { toMatchOneOf } from './toMatchOneOf'
import MatcherUtils = jest.MatcherUtils

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchShapeOf(expected: any): R, // tslint:disable-line:no-any
    }
  }
}


export function toMatchShapeOf <T>(this: MatcherUtils | void, received: T, expected: T): JestResult {
  return toMatchOneOf.bind(this)(received, [expected])
}
