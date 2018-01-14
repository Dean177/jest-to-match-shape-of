import { toMatchOneOf } from './toMatchOneOf'

describe('error messages', () => {
  expect.extend({ toMatchOneOf })
  it('Produces good error messages for deep objects', () => {
    const optionOne = { a: 3, b: '3' }
    const optionTwo = { a: 4, b: '5' }

    expect({ a: 2, b: null }).not.toMatchOneOf([optionOne, optionTwo])
  })
})