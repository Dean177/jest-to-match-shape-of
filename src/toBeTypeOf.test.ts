import { toBeTypeOf } from './toBeTypeOf'

describe('toBeTypeOf', () => {
  expect.extend({ toBeTypeOf })

  it('Returns no error when the types match', () => {
    expect(false).toBeTypeOf(true)

    expect(1).toBeTypeOf(0)

    expect('a').toBeTypeOf('b')
    expect('a').toBeTypeOf('')

    expect([1, 2, 3]).toBeTypeOf([1, 2, 3])
    expect([1, 2, 3]).toBeTypeOf([])
    expect([1, 2, 3]).toBeTypeOf(['a', 'b', 'c'])

    expect(() => true).toBeTypeOf(() => false)
    expect(() => 6).toBeTypeOf(function() { return 7 })

    expect(null).toBeTypeOf(null)

    expect(undefined).toBeTypeOf(undefined)
  })

  it(`fails when the types don't match`, () => {
    expect('a').not.toBeTypeOf(false)
    expect(1).not.toBeTypeOf('b')
    expect('a').not.toBeTypeOf([])
    expect(null).not.toBeTypeOf(1)
    expect(null).not.toBeTypeOf(() => null)
    expect({}).not.toBeTypeOf([])
  })
})
