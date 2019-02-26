// tslint:disable:no-any
import { toMatchShapeOf } from './toMatchShapeOf'

describe('toMatchShapeOf', () => {
  expect.extend({ toMatchShapeOf })

  const simpleObject = { a: 4, b: 17, c: 'cat' }
  const expectedSimple = { a: 1, b: 2, c: '1' }

  it('checks that expected has the same shape, with the same keys and types', () => {
    expect(simpleObject).toMatchShapeOf(expectedSimple)
  })

  it('will fail if one of the properties has a different type', () => {
    expect({ a: true, b: 17, c: 'cat' } as any).not.toMatchShapeOf(expectedSimple)
  })

  it('checks that expected has the same shape, with the same keys and types', () => {
    const received = { a: 4, b: 17, c: 'cat', d: []  }
    const expected = { a: '', b: false, c: null, d: true, e: [] }

    const { message, pass } = toMatchShapeOf(received as any, expected)
    expect(pass).toBe(false)
    expect(message()).not.toBe('')
  })

  it('checks that expected has the same shape, with the same keys and types', () => {
    const received = {
      a: 1, b: null, c: 3, d: { one: 'a', two: 'b', three: 'c' }, e: null, f: undefined,
    }
    const expected = {
      a: false, b: { alpha: 7, beta: 8 }, c: false, d: { one: 1, two: 2, three: 3 }, e: false, g: true,
    }

    const { message, pass } = toMatchShapeOf(received as any, expected)
    expect(pass).toBe(false)
    expect(message()).not.toBe('')
  })

  it('will fail when provided with different types', () => {
    const missingKeyResult = toMatchShapeOf({ a: [], b: [], c: [] } as any, { a: 5, b: '5', c: null })
    expect(missingKeyResult.pass).toBe(false)
  })

  it('can handle nested objects', () => {
    const nestedObject = { a: true, b: { age: 1, name: 'dog' } }
    const expectedNested = { a: false, b: { age: 12, name: 'emu' } }
    expect(toMatchShapeOf(nestedObject, expectedNested).pass).toBe(true)

    const failResult = toMatchShapeOf({ b: { name: 'emu' } } as any, { b: { age: 12, name: 'emu' } })
    expect(failResult.pass).toBe(false)
  })

  it('passes when received has keys which are not on expected', () => {
    const extraKeysResult = toMatchShapeOf({ a: 1, b: 3, c: [] } as any, { a: 1, b: 2 })
    expect(extraKeysResult.pass).toBe(true)
  })

  it('fails when expected is missing a key in test', () => {
    const missingKeyResult = toMatchShapeOf({ a: 1 } as any, { a: 1, b: 2 })
    expect(missingKeyResult.pass).toBe(false)
  })
})
