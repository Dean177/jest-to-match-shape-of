import { toMatchOneOf } from './toMatchOneOf'
import { toMatchShapeOf } from './toMatchShapeOf'

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
