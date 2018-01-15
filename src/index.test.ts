import { toMatchOneOf } from './toMatchOneOf'

describe('error messages', () => {
  expect.extend({ toMatchOneOf })

  it('Produces good error messages for arrays of literals', () => {
    expect([1, 'false']).toMatchOneOf(['str', true])
  })

  it('Produces good error messages for arrays', () => {
    const optionOne = { b: '3' }
    const optionTwo = { b: '5' }

    expect([{ b: 5 }, { b: null }]).toMatchOneOf([optionOne, optionTwo])
  })

  it('Produces good error messages for deep objects', () => {
    const optionOne = { a: 3, b: '3' }
    const optionTwo = { a: 4, b: '5' }

    expect({ a: 2, b: { a: 2 } }).toMatchOneOf([optionOne, optionTwo])
  })
})
