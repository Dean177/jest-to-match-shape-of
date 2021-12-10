# toMatchShapeOf

[![CircleCI](https://circleci.com/gh/Dean177/jest-to-match-shape-of.svg?style=shield)](https://circleci.com/gh/Dean177/jest-to-match-shape-of)
[![codecov](https://codecov.io/gh/Dean177/jest-to-match-shape-of/branch/master/graph/badge.svg)](https://codecov.io/gh/Dean177/jest-to-match-shape-of)
[![Npm](https://badge.fury.io/js/jest-to-match-shape-of.svg)](https://www.npmjs.com/package/jest-to-match-shape-of)

A [Jest matcher](https://facebook.github.io/jest/docs/en/using-matchers.html) to verify the structure of an object, particularly useful for API integration tests.

![example-gif](./example/huge-demo-gif.gif)

## Installation

First install the package via `npm`, `pnpm` or `yarn`:

```bash
npm install --save-dev jest-to-match-shape-of
```

```bash
pnpm add --dev jest-to-match-shape-of
```

```bash
yarn add --dev jest-to-match-shape-of
```

Then create a file to setup your tests. This guide uses `test/setup.js` (for Javascript projects) or `test/setup.ts` (for Typescript projects), but it should still work if you place it somewhere else.

Add the following to `test/setup.js` file (if you are using CommonJS):

```javascript
// /test/setup.js
// Setup your test environment

const { toMatchOneOf, toMatchShapeOf } = require('jest-to-match-shape-of')

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
```

If you are using ESM or Typescript, use the following instead:

```typescript
// /test/setup.ts
// Setup your test environment

import { toMatchOneOf, toMatchShapeOf } from 'jest-to-match-shape-of'

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
```

Then add the following to your [Jest configuration](https://jestjs.io/docs/configuration):

```jsonc
// CommonJS/ESM
"setupFilesAfterEnv": ["./test/setup.js"]

// Typescript
"setupFilesAfterEnv": ["./test/setup.ts"]
```

For usage in a project created using CRA ([`create-react-app`](https://create-react-app.dev/)) you simply need to add the above setup code to the test setup file (usually `src/setupTests.js` or `src/setupTests.ts`), there is no need to modify your Jest configuration.

```javascript
import '@testing-library/jest-dom'

import { toMatchOneOf, toMatchShapeOf } from 'jest-to-match-shape-of'

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
```

## Usage

```typescript
expect(someThing).toMatchOneOf([
  someOtherThingA,
  someOtherThingB,
  someOtherThingC,
])
expect(someThing).toMatchShapeOf(someOtherThing)
```

Works particularly well when being used with [Typescript](https://www.typescriptlang.org/) to write integration tests e.g.

```typescript
type Resource = {
  maybeNumber: number | null
  someString: string
}

const testResource: Resource = {
  maybeNumber: 6,
  someString: 'some real looking data',
}

const testResourceAlt: Resource = {
  maybeNumber: null,
  someString: 'some real looking data',
}

describe('an api', () => {
  it('returns what I was expecting', () => {
    return fetch('/resources/1')
      .then((response) => response.json())
      .then((data) => {
        expect(data).toMatchShapeOf(testResource)
      })
  })

  it('could return a couple of different things', () => {
    return fetch('/resources/1')
      .then((response) => response.json())
      .then((data) => {
        expect(data).toMatchOneOf([testResource, testResourceAlt])
      })
  })
})
```

### Matching Optional Fields

Sometimes, the expected shape may vary during integration tests (for example, a field may be missing).

If you want to make a shape allow optional fields, the simplest way is to remove those fields from the expected shape, as follow:

```typescript
toMatchShapeOf({ ant: 17 }) // `bat` is optional here
```

A more robust alternative is to define all possible shapes, this way you still test the types of the properties:

```typescript
toMatchOneOf([{ ant: 17, bat: 176 }, { ant: 17 }]) // `bat` is still optional, but must be numeric
```

## Motivation

I wanted to write integration test for my frontend code but found it was tedious, brittle and
hard to debug when I encountered a legitimate failure.

I realised that

- Almost all of the errors were due to bad data from the API, most often missing data
- I did not care about _exactly_ what data came back, but more about the _shape_ of the data.
- Since I was using React and Typescript I could be confident my app would work as intended if the types were correct
- Thanks to [Enzyme](https://github.com/airbnb/enzyme), I already had a great way to test my component interactions

`toMatchShapeOf` hopefully achieves a lot of the value of full blown integration test written with something like
[Nightwatch](http://nightwatchjs.org/) whilst being simpler to write, understand and debug.

I also found out that the test data I created for use with this matcher was useful for other unit tests in my application.
