import { toMatchOneOf, toMatchShapeOf } from './toMatchShapeOf';

declare namespace jest {
  interface Matchers<R> {
    toMatchOneOf(expected: Array<any>): R,
    toMatchShapeOf(expected: any): R,
  }
}

jasmine.addMatchers({
  toMatchOneOf,
  toMatchShapeOf,
});
