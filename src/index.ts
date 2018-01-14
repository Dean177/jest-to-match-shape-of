import { toMatchOneOf, toMatchShapeOf } from './toMatchShapeOf'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchOneOf(expected: Array<any>): R, // tslint:disable-line:no-any
      toMatchShapeOf(expected: any): R, // tslint:disable-line:no-any
    }
  }
}

jasmine.addMatchers({
  toMatchOneOf,
  toMatchShapeOf,
})