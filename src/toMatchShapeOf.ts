import { green, red } from 'chalk';
import { every, flatMap, flatten, head, isUndefined, keys as keysOf, map, repeat, some, uniq } from 'lodash';
import { Result, MatcherFactory } from './common-types';
import { toBeTypeOfCompare } from './toBeTypeOf';


export const toMatchShapeOfCompare = <T>(actual: T, expected: T): Result =>
  toMatchOneOfCompare(actual, [expected]);

export const toMatchShapeOf: MatcherFactory = (util, customEqualityTesters) => ({
  compare: toMatchShapeOfCompare,
});

const successResult = { message: '', pass: true };
export const toMatchOneOfCompare = <T>(actual: T, expectedValues: Array<T>, keys: Array<string> = []): Result => {
  if (Array.isArray(actual)) {
    if (actual.length === 0) {
      return successResult;
    }

    const results = actual.map(cActual => toMatchOneOfCompare(cActual, expectedValues, keys));
    if (every(results, ({ pass }) => pass)) {
      return successResult;
    } else {
      return {
        message: (head(results.filter(({ pass }) => !pass))).message,
        pass: false,
      };
    }

  }

  if (actual != null && typeof actual === 'object') {
    const validKeys = uniq(flatMap(expectedValues, keysOf));
    const possibleValuesForKey = validKeys.reduce(
      (acc, key) => {
        acc[key] = flatten(expectedValues.filter(expected => !isUndefined(expected)).map(e => e && e[key]));
        return acc;
      },
      {} as { [key: string]: Array<any> },
    );

    const results = map(
      possibleValuesForKey,
      (values: Array<any>, key: string): Result => toMatchOneOfCompare(actual[key], values, [...keys, key]),
    );

    const passed = !some(results, ({ pass }) => !pass);
    return {
      message: passed ? '' : results.map(({ message }) => message).join(''),
      pass: passed,
    };
  }

  const matcherResults = expectedValues.map(expected => toBeTypeOfCompare(actual, expected));
  const passed = !every(matcherResults, ({ pass }) => !pass);
  if (passed) {
    return successResult;
  }

  const expectedTypes: Array<string> = expectedValues.map(expected => {
    if (expected != null && typeof expected === 'object') {
      return JSON.stringify(expected);
    } else if (expected === null) {
      return 'null';
    } else if (isUndefined(expected)) {
      return 'undefined';
    }

    return (typeof expected);
  });

  const typeMessage = (expectedTypes.length === 1)
    ? `to be ${green(expectedTypes[0])}`
    : `to be one of [${green(expectedTypes.join(', '))}]`;

  const prefix = (keys.length === 0) ? 'E' : `${repeat('  ', keys.length)}For '${keys.join('.')}' e`;
  const message =  `${prefix}xpected value: ${red(JSON.stringify(actual))} ${typeMessage}\n`;

  return { message, pass: false };
};

export const toMatchOneOf: MatcherFactory = (util, customEqualityTesters) => ({
  compare: toMatchOneOfCompare,
});
