// tslint:disable:no-any
import { toMatchOneOfCompare, toMatchShapeOfCompare } from './toMatchShapeOf';

describe('toMatchShapeOf', () => {
  it('checks that expected has the same shape, with the same keys and types', () => {
    const simpleObject = { a: 4, b: 17, c: 'cat' };
    const expectedSimple = { a: 1, b: 2, c: '1' };
    expect(toMatchShapeOfCompare(simpleObject, expectedSimple).pass).toBeTruthy();
    const result = toMatchShapeOfCompare({ a: true, b: 17, c: 'cat' } as any, expectedSimple);
    expect(result.message).not.toBe('');
    expect(result.pass).toBeFalsy();
  });

  it('checks that expected has the same shape, with the same keys and types', () => {
    const actual = { a: 4, b: 17, c: 'cat', d: []  };
    const expected = { a: '', b: false, c: null, d: true, e: [] };

    const { message, pass } = toMatchShapeOfCompare(actual as any, expected);
    expect(pass).toBeFalsy();
    expect(message).not.toBe('');
  });

  it('checks that expected has the same shape, with the same keys and types', () => {
    const actual = {
      a: 1, b: null, c: 3, d: { one: 'a', two: 'b', three: 'c' }, e: null, f: undefined,
    };
    const expected = {
      a: false, b: { alpha: 7, beta: 8 }, c: false, d: { one: 1, two: 2, three: 3 }, e: false, g: true,
    };

    const { message, pass } = toMatchShapeOfCompare(actual as any, expected);
    expect(pass).toBeFalsy();
    expect(message).not.toBe('');
  });

  it('can handle nested objects', () => {
    const nestedObject = { a: true, b: { age: 1, name: 'dog' } };
    const expectedNested = { a: false, b: { age: 12, name: 'emu' } };
    expect(toMatchShapeOfCompare(nestedObject, expectedNested).pass).toBeTruthy();

    const failResult = toMatchShapeOfCompare({ b: { name: 'emu' } } as any, { b: { age: 12, name: 'emu' } });
    expect(failResult.pass).toBeFalsy();
  });

  it('passes when actual has keys which are not on expected', () => {
    const extraKeysResult = toMatchShapeOfCompare({ a: 1, b: 3, c: [] } as any, { a: 1, b: 2 });
    expect(extraKeysResult.pass).toBeTruthy();
  });

  it('fails when expected is missing a key in test', () => {
    const missingKeyResult = toMatchShapeOfCompare({ a: 1 } as any, { a: 1, b: 2 });
    expect(missingKeyResult.pass).toBeFalsy();
  });
});

describe('toMatchOneOf', () => {
  it('accepts multiple accepted values, only failing if *none* of the possibilities match', () => {
    const { message, pass } = toMatchOneOfCompare(1 as any, [2, '1', false]);
    expect(message).toBe('');
    expect(pass).toBeTruthy();
  });

  it('fails when none of the provided values match', () => {
    const { message, pass } = toMatchOneOfCompare('no' as any, [2, undefined, false] as any);
    expect(message).not.toBe('');
    expect(pass).toBeFalsy();
  });

  it('works with null', () => {
    const possibleLiterals = toMatchOneOfCompare(null as any, [1, null]);
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('works with undefined', () => {
    const possibleLiterals = toMatchOneOfCompare(undefined as any, [2, undefined]);
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('works with undefined - failure case', () => {
    const possibleLiterals = toMatchOneOfCompare(undefined, [2, 'b']);
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('works with undefined and objects - failure case', () => {
    const possibleLiterals = toMatchOneOfCompare(undefined, [{ a: 1 }, { a: 2 }]);
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('will accept an array', () => {
    const { message, pass } = toMatchOneOfCompare(['abc', 'def'] as any, ['ghi']);
    expect(message).toBe('');
    expect(pass).toBeTruthy();
  });

  it('will accept an array', () => {
    const { message, pass } = toMatchOneOfCompare(['abc', 'def'] as any, ['ghi']);
    expect(message).toBe('');
    expect(pass).toBeTruthy();
  });

  it(`fails if one of the elements in the actual array doesn't match any of the results in the expected array`, () => {
    const { message, pass } = toMatchOneOfCompare(['abc', null] as any, ['def', 'ghi']);
    expect(message).not.toBe('');
    expect(pass).toBeFalsy();

    const resultB = toMatchOneOfCompare(['abc', 2] as any, ['def', 'ghi']);
    expect(resultB.message).not.toBe('');
    expect(resultB.pass).toBeFalsy();
  });

  it('will navigate into nested objects if all of the examples have the key', () => {
    const example = { a: 2, b: 'two' };
    const optionOne = { a: 3, b : 'three' };
    const optionTwo = { a: 4, b : 'four' };

    const possibleLiterals = toMatchOneOfCompare(example, [optionOne, optionTwo]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('passes when the actual object provides more keys than the expecteds', () => {
    const example = { a: 2, b: 'two', c: false };
    const optionOne = { a: 3, b : 'three' };
    const optionTwo = { a: 4, b : 'four' };

    const possibleLiterals = toMatchOneOfCompare(example, [optionOne, optionTwo]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('will fail for undefined keys if they are present on all expecteds', () => {
    const example = { a: 2 };
    const optionOne = { a: 3, b : '3' };
    const optionTwo = { a: 4, b : null };

    const possibleLiterals = toMatchOneOfCompare(example, [optionOne, optionTwo]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('will passes objects with null keys, if an expected value also has a null key', () => {
    const example = { a: 2, b: null };
    const optionOne = { a: 3, b : '3' };
    const optionTwo = { a: 4, b : null };

    const possibleLiterals = toMatchOneOfCompare(example, [optionOne, optionTwo]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('will passes objects with null keys, if an expected value also has a null key for deep objects', () => {
    const example = { a: 2, b: null };
    const optionOne = { a: 3, b : { c: '8' } };
    const optionTwo = { a: 4, b : null };

    const possibleLiterals = toMatchOneOfCompare(example, [optionOne, optionTwo]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('will pass for undefined keys of one of the expects is also missing the key', () => {
    const example = { a: 2 };
    const optionOne = { a: 3 };
    const optionTwo = { a: 4, b: '' };

    const possibleLiterals = toMatchOneOfCompare(example, [optionOne, optionTwo]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('will navigate into nested objects if all of the examples have the key', () => {
    const example =   { a: 2, b: null };

    const optionOne = { a: 3, b: '3' };
    const optionTwo = { a: 4, b: '5' };

    const possibleLiterals = toMatchOneOfCompare(example as any, [optionOne, optionTwo]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('deeply nested objects', () => {
    const example = { a: { b: { c: {
      one: 1,
      two: 2,
    }}}};

    const exampleA = { a: { b: { c: {
      two: 2,
    }}}};
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}};

    const possibleLiterals = toMatchOneOfCompare(example, [exampleA, exampleB]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('deeply nested objects - failure case', () => {
    const example = { a: { b: { c: {
      one: 1,
    }}}};

    const exampleA = { a: { b: { c: {
      two: 2,
    }}}};
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}};

    const possibleLiterals = toMatchOneOfCompare(example as any, [exampleA, exampleB]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('deeply nested objects with null subtrees', () => {
    const example = { a: { b: null }};
    const exampleA = { a: { b: null }};
    const exampleB = { a: { b: { c: true }}};

    const possibleLiterals = toMatchOneOfCompare(example, [exampleA, exampleB]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('deeply nested objects with null subtrees - failure case', () => {
    const example =  { a: { b: null }};
    const exampleA = { a: { b: { c: true }}};
    const exampleB = { a: { b: { c: true }}};

    const possibleLiterals = toMatchOneOfCompare(example as any, [exampleA, exampleB]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('deeply nested objects with null subtrees - alt failure case', () => {
    const example = { a: { b: { c: {
      two: 2,
    }}}};

    const exampleA = { a: { b: null } };
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}};
    const exampleC = { a: { b: { c: {
      one: 8,
      two: 3,
    }}}};

    const possibleLiterals = toMatchOneOfCompare(example  as any, [exampleA, exampleB, exampleC]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('deeply nested objects with missing subtrees', () => {
    const example = { a: { b: { c: {
      one: 1,
      two: 2,
    }}}};

    const exampleA = { a: {} };
    const exampleB = { a: { b: { c: {
      one: 7,
      two: 2,
    }}}};

    const possibleLiterals = toMatchOneOfCompare(example as any, [exampleA, exampleB]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('deeply nested objects with missing subtrees - failure case', () => {
    const example = { b: { two: 2 }};

    const exampleA = {};
    const exampleB = { b: { one: 7, two: 2 }};
    const exampleC = { b: { one: 8, two: 3 }};

    const possibleLiterals = toMatchOneOfCompare(example as any, [exampleA, exampleB, exampleC]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('deeply nested objects with missing subtrees - failure case', () => {
    const example = { two: 2 };

    const exampleA = undefined;
    const exampleB = { one: 7, two: 2 };
    const exampleC = { one: 8, two: 3 };

    const possibleLiterals = toMatchOneOfCompare(example as any, [exampleA, exampleB, exampleC]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });

  it('deeply nested arrays - success case', () => {
    const example = { a: { b: [
      { one: 1, two: 2 },
      { one: 1 },
    ]}};

    const exampleA = { a: {} };
    const exampleB = { a: { b: []}};
    const exampleC = { a: { b: [
      { one: 3, two: 4 },
      { one: 5 },
    ]}};

    const possibleLiterals = toMatchOneOfCompare(example, [exampleA, exampleB, exampleC]);

    expect(possibleLiterals.message).toBe('');
    expect(possibleLiterals.pass).toBeTruthy();
  });

  it('deeply nested arrays - failure case', () => {
    const example = { a: { b: [
      { one: 1 },
      { one: 1 },
    ]}};

    const exampleA = { a: { b: []}};
    const exampleB = { a: { b: [
      { one: 3, two: 4 },
      { one: 5, two: 5 },
    ]}};
    const exampleC = { a: { b: [
      { one: 4, two: 4 },
      { one: 6, two: 6 },
    ]}};

    const possibleLiterals = toMatchOneOfCompare(example, [exampleA, exampleB, exampleC]);

    expect(possibleLiterals.message).not.toBe('');
    expect(possibleLiterals.pass).toBeFalsy();
  });
});
