import { toMatchOneOf } from './toMatchOneOf'

describe('toMatchOneOf', () => {
  expect.extend({ toMatchOneOf })

  it('accepts multiple accepted values, only failing if *none* of the possibilities match', () => {
    expect(1).toMatchOneOf([2, '1', false])
  })

  it('fails when none of the provided values match', () => {
    expect('a string').not.toMatchOneOf([2, undefined, false])
  })

  it('works with boolean values', () => {
    expect(false).toMatchOneOf(['a str', true])
  })

  it('works with Date objects', () => {
    expect(new Date(1)).toMatchOneOf([2, new Date(2)])
  })

  it('passes when received is null and one of the expected values is null', () => {
    expect(null).toMatchOneOf([1, null])
  })

  it('fails when received is null and one of the expected values is null', () => {
    expect(null).not.toMatchOneOf([1, 'a string'])
  })

  it('fails when received is null and the expected values are objects', () => {
    expect(null).not.toMatchOneOf([{ a: 1 }, { a: 2 }])
  })

  it('passes when received is undefined and one of the expected values is undefined', () => {
    expect(undefined).toMatchOneOf([2, undefined])
  })

  it('fails when received is undefined and none of the expected values are undefined', () => {
    expect(undefined).not.toMatchOneOf([2, 'b'])
  })

  it('fails when received is undefined and the expected values are objects', () => {
    expect(undefined).not.toMatchOneOf([{ a: 1 }, { a: 2 }])
  })

  it('passes and array when every element of the received array has a type in the expected array', () => {
    expect(['abc', 'def']).toMatchOneOf(['ghi'])
  })

  it('will not accept values when the expected is an empty array', () => {
    expect({ a: [1, 2, 3]}).not.toMatchOneOf([{ a: []}])
  })

  it(`fails an array if an element of the received array doesn't match a type in the expected array`, () => {
    expect(['abc', null]).not.toMatchOneOf(['def', 'ghi'])
    expect(['abc', 2]).not.toMatchOneOf(['def', 'ghi'])
  })

  it('passes when all of the keys on received match types on the expected values', () => {
    const optionOne = { a: 3, b : 'three' }
    const optionTwo = { a: 4, b : 'four' }

    expect({ a: 2, b: 'two' }).toMatchOneOf([optionOne, optionTwo])
  })

  it('passes when the received object provides more keys than the expected values', () => {
    const optionOne = { a: 3, b : 'three' }
    const optionTwo = { a: 4, b : 'four' }

    expect({ a: 2, b: 'two', c: false }).toMatchOneOf([optionOne, optionTwo])
  })

  it('passes when the received object is missing keys if one of the expected values is missing the same key', () => {
    const optionOne = { a: 3, b: '3' }
    const optionTwo = { a: 4, b: undefined }

    expect({ a: 2 }).toMatchOneOf([optionOne, optionTwo])
  })

  it('fails when the received object is missing keys if they are present on all expected values, even null', () => {
    expect({ a: 2 }).not.toMatchOneOf([{ a: 3, b : '3' }, { a: 4, b : null }])
  })

  it('fails when the received has a null key when none of the expected values have the key as null', () => {
    const optionOne = { a: 3, b: '3' }
    const optionTwo = { a: 4, b: '5' }

    expect({ a: 2, b: null }).not.toMatchOneOf([optionOne, optionTwo])
  })

  it('passes when the received has a null key, if an expected value also has a null key', () => {
    const optionOne = { a: 3, b: '3' }
    const optionTwo = { a: 4, b: null }

    expect({ a: 2, b: null }).toMatchOneOf([optionOne, optionTwo])
  })

  it('will passes objects with null keys, if an expected value also has a null key for deep objects', () => {
    const optionOne = { a: 3, b: { c: '8' } }
    const optionTwo = { a: 4, b: null }

    expect({ a: 2, b: null }).toMatchOneOf([optionOne, optionTwo])
  })

  it('will pass for undefined keys of one of the expects is also missing the key', () => {
    const optionOne = { a: 3 }
    const optionTwo = { a: 4, b: '' }

    expect({ a: 2 }).toMatchOneOf([optionOne, optionTwo])
  })

  it('deeply nested objects', () => {
    const example = { a: { b: { c: {
      one: 1,
      two: 2,
    }}}}

    const exampleA = { a: { b: { c: {
      two: 2,
    }}}}
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}}

    expect(example).toMatchOneOf([exampleA, exampleB])
  })

  it('deeply nested objects - failure case', () => {
    const example = { a: { b: { c: {
      one: 1,
    }}}}

    const exampleA = { a: { b: { c: {
      two: 2,
    }}}}
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}}

    expect(example).not.toMatchOneOf([exampleA, exampleB])
  })

  it('deeply nested objects with null subtrees', () => {
    const example = { a: { b: null }}
    const exampleA = { a: { b: null }}
    const exampleB = { a: { b: { c: true }}}

    expect(example).toMatchOneOf([exampleA, exampleB])
  })

  it('deeply nested objects with null subtrees - failure case', () => {
    const example =  { a: { b: null }}
    const exampleA = { a: { b: { c: true }}}
    const exampleB = { a: { b: { c: true }}}

    expect(example).not.toMatchOneOf([exampleA, exampleB])
  })

  it('deeply nested objects with null subtrees - alt failure case', () => {
    const example = { a: { b: { c: {
      two: 2,
    }}}}

    const exampleA = { a: { b: null } }
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}}
    const exampleC = { a: { b: { c: {
      one: 8,
      two: 3,
    }}}}

    expect(example).not.toMatchOneOf([exampleA, exampleB, exampleC])
  })

  it('deeply nested objects with missing subtrees', () => {
    const example = { a: { b: { c: {
      one: 1,
      two: 2,
    }}}}

    const exampleA = { a: {} }
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}}

    expect(example).toMatchOneOf([exampleA, exampleB])
  })

  it('deeply nested objects with missing subtrees - failure case', () => {
    const exampleA = {}
    const exampleB = { b: { one: 7, two: 2 }}
    const exampleC = { b: { one: 8, two: 3 }}

    expect({ b: { two: 2 }}).not.toMatchOneOf([exampleA, exampleB, exampleC])
  })

  it('deeply nested objects with missing subtrees - failure case', () => {
    const exampleA = undefined
    const exampleB = { one: 7, two: 2 }
    const exampleC = { one: 8, two: 3 }

    expect({ two: 2 }).not.toMatchOneOf([exampleA, exampleB, exampleC])
  })

  it('deeply nested arrays - success case', () => {
    const example = { a: { b: [
      { one: 1, two: 2 },
      { one: 1 },
    ]}}

    const exampleA = { a: {} }
    const exampleB = { a: { b: []}}
    const exampleC = { a: { b: [
      { one: 3, two: 4 },
      { one: 5 },
    ]}}

    expect(example).toMatchOneOf([exampleA, exampleB, exampleC])
  })

  it('deeply nested arrays - failure case', () => {
    const example = { a: { b: [
      { one: 1 },
      { one: 1 },
    ]}}

    const exampleA = { a: { b: []}}
    const exampleB = { a: { b: [
      { one: 3, two: 4 },
      { one: 5, two: 5 },
    ]}}
    const exampleC = { a: { b: [
      { one: 4, two: 4 },
      { one: 6, two: 6 },
    ]}}

    expect(example).not.toMatchOneOf([exampleA, exampleB, exampleC])
  })
})
