import { toMatchOneOf, toMatchShapeOf } from './toMatchShapeOf';

export namespace jest {
  export interface Matchers<R> {
    toMatchOneOf(expected: Array<any>): R,
    toMatchShapeOf(expected: any): R,
  }
}

jasmine.addMatchers({
  toMatchOneOf,
  toMatchShapeOf,
});
