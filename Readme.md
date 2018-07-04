# toMatchShapeOf

[![CircleCI](https://circleci.com/gh/Dean177/jest-to-match-shape-of.svg?style=shield)](https://circleci.com/gh/Dean177/jest-to-match-shape-of)
[![codecov](https://codecov.io/gh/Dean177/jest-to-match-shape-of/branch/master/graph/badge.svg)](https://codecov.io/gh/Dean177/jest-to-match-shape-of)
[![Greenkeeper badge](https://badges.greenkeeper.io/Dean177/jest-to-match-shape-of.svg)](https://greenkeeper.io/)
[![Npm](https://badge.fury.io/js/jest-to-match-shape-of.svg)](https://www.npmjs.com/package/jest-to-match-shape-of)


A [Jest matcher](https://facebook.github.io/jest/docs/en/using-matchers.html) to verify the structure of an object, particularly useful for api integration tests

![example-gif](./example/huge-demo-gif.gif)

## Installation

```bash
yarn add jest-to-match-shape-of
```

```bash
npm install jest-to-match-shape-of --save
```

In your setupTests.js
```javascript
// src/setupTests.js
const { toMatchOneOf, toMatchShapeOf } = require('jest-to-match-shape-of')

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
```
or if you are using Typescript

```typescript
// src/setupTests.js
import { toMatchOneOf, toMatchShapeOf } from 'jest-to-match-shape-of'

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
```

Then in the "jest" section of your package.json add the following:
`"setupTestFrameworkScriptFile": "<rootDir>/src/setupTests.js"`

or for typescript:
`"setupTestFrameworkScriptFile": "<rootDir>/src/setupTests.ts"`

### Installation with create-react-app
For project created using CRA (create-react-app) you need to add setup code to the `setupTests.js` file, there is no need to modify `package.json`.

```
// src/setupTests.js
const { toMatchOneOf, toMatchShapeOf } = require('jest-to-match-shape-of')
// or with ES6 module import { toMatchOneOf, toMatchShapeOf } from 'jest-to-match-shape-of';

expect.extend({
  toMatchOneOf,
  toMatchShapeOf,
})
```

## Usage

```javascript
expect(someThing).toMatchOneOf([someOtherThingA, someOtherThingB, someOtherThingC])
expect(someThing).toMatchShapeOf(someOtherThing)
```

Works particularly well when being used with [Typescript](https://www.typescriptlang.org/) to write integration tests e.g.

```typescript
type Resource = {
  maybeNumber: number | null, 
  someString: string,
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
    return fetch('/resources/1').then(response => response.json()).then((data) => {
      expect(data).toMatchShapeOf(testResource)  
    })            
  })
  
  it('could return a couple of different things', () => {
    return fetch('/resources/1').then(response => response.json()).then((data) => {
      expect(data).toMatchOneOf([testResource, testResourceAlt])  
    })    
  })
})

```

## Motivation

I wanted to write integration test for my frontend code but found it was tedious, brittle and 
hard to debug when I encountered a legitimate failure. 

I realised that
- Almost all of the errors were due to bad data from the API, most often missing data
- I did not care about *exactly* what data came back, but more about the *shape* of the data.
- Since I was using React and Typescript I could be confident my app would work as intended if the types were correct
- Thanks to [Enzyme](https://github.com/airbnb/enzyme) I already had a great way to test my component interactions
 
 `toMatchShapeOf` hopefully achieves a lot of the value of full blown integration test written with something like 
[Nightwatch](http://nightwatchjs.org/) whilst being simpler to write, understand and debug.

Additionally I found that the test data I created for use with this matcher were useful for other unit tests in my application.
