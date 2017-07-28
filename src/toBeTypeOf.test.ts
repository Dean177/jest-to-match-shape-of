import { toBeTypeOfCompare } from './toBeTypeOf';

describe('toBeTypeOf', () => {
  it('Returns no error when the types match', () => {
    expect(toBeTypeOfCompare(false, true).pass).toBeTruthy();

    expect(toBeTypeOfCompare(1, 0).pass).toBeTruthy();

    expect(toBeTypeOfCompare('a', 'b').pass).toBeTruthy();
    expect(toBeTypeOfCompare('a', '').pass).toBeTruthy();

    expect(toBeTypeOfCompare([1, 2, 3], [1, 2, 3]).pass).toBeTruthy();
    expect(toBeTypeOfCompare([1, 2, 3], []).pass).toBeTruthy();
    expect(toBeTypeOfCompare([1, 2, 3], ['a', 'b', 'c']).pass).toBeTruthy();

    expect(toBeTypeOfCompare(() => {}, () => {}).pass).toBeTruthy();
    expect(toBeTypeOfCompare(() => {}, function() {}).pass).toBeTruthy();

    expect(toBeTypeOfCompare(null, null).pass).toBeTruthy();

    expect(toBeTypeOfCompare(undefined, undefined).pass).toBeTruthy();
  });

  it(`fails when the types don't match`, () => {
    expect(toBeTypeOfCompare('a', false).pass).toBeFalsy();
    expect(toBeTypeOfCompare(1, 'b').pass).toBeFalsy();
    expect(toBeTypeOfCompare('a', []).pass).toBeFalsy();
    expect(toBeTypeOfCompare(null, 1).pass).toBeFalsy();
    expect(toBeTypeOfCompare(null, () => {}).pass).toBeFalsy();

    expect(toBeTypeOfCompare({}, []).pass).toBeFalsy();
  });
});
