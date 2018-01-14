import { toBeTypeOfCompare } from './toBeTypeOf'

describe('toBeTypeOf', () => {
  it('Returns no error when the types match', () => {
    expect(toBeTypeOfCompare(false, true).pass).toBe(true)

    expect(toBeTypeOfCompare(1, 0).pass).toBe(true)

    expect(toBeTypeOfCompare('a', 'b').pass).toBe(true)
    expect(toBeTypeOfCompare('a', '').pass).toBe(true)

    expect(toBeTypeOfCompare([1, 2, 3], [1, 2, 3]).pass).toBe(true)
    expect(toBeTypeOfCompare([1, 2, 3], []).pass).toBe(true)
    expect(toBeTypeOfCompare([1, 2, 3], ['a', 'b', 'c']).pass).toBe(true)

    expect(toBeTypeOfCompare(() => true, () => false).pass).toBe(true)
    expect(toBeTypeOfCompare(() => 6, function() { return 7 }).pass).toBe(true)

    expect(toBeTypeOfCompare(null, null).pass).toBe(true)

    expect(toBeTypeOfCompare(undefined, undefined).pass).toBe(true)
  })

  it(`fails when the types don't match`, () => {
    expect(toBeTypeOfCompare('a', false).pass).toBe(false)
    expect(toBeTypeOfCompare(1, 'b').pass).toBe(false)
    expect(toBeTypeOfCompare('a', []).pass).toBe(false)
    expect(toBeTypeOfCompare(null, 1).pass).toBe(false)
    expect(toBeTypeOfCompare(null, () => null).pass).toBe(false)

    expect(toBeTypeOfCompare({}, []).pass).toBe(false)
  })
})
