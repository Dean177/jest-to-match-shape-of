import { green, red } from 'chalk';
import { Result } from './common-types';

export const toBeTypeOfCompare = (actual: any, expected: any): Result => {
  if (actual == null && expected != null) {
    return {
      message: `expected '${green(typeof expected)}' but got '${red(actual)}'`,
      pass: false,
    };
  }

  if (Array.isArray(expected)) {
    const pass = Array.isArray(actual);
    const message = (!pass) ?
      `expected '${green('array')}', but was '${red(typeof actual)}'` :
      '';
    return { message, pass };
  }

  const pass = typeof actual === typeof expected;
  const message = (!pass) ?
    `expected '${green(typeof expected)}', but was '${red(typeof actual)}' for ${JSON.stringify(actual)}` :
    '';
  return { message, pass };
};
