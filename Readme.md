# toMatchShapeOf

Provides two matchers which make it easy to test that an object is roughly the shape expect

## Installation

```bash
yarn add jest-to-match-shape-of
```

```bash
npm install jest-to-match-shape-of
```

In your setupTestEnvironment.js
```javascript
// src/setupTestEnvironment.js
require('jest-to-match-shape-of');
```
or if you are using typescript

```typescript
// src/setupTestEnvironment.ts
import 'jest-to-match-shape-of';
```

Then in the "jest" section of your package.json add the following:
`"setupTestFrameworkScriptFile": "<rootDir>/src/setupTestEnvironment.ts"`

or for typescript:
`"setupTestFrameworkScriptFile": "<rootDir>/src/setupTestEnvironment.ts"`

## Usage

```
expect(someThing).toMatchOneOf([someOtherThingA, someOtherThingB, someOtherThingC]);
expect(someThing).toMatchShapeOf(someOtherThing);
```

Works particularly well when being used with typescript to write integration tests e.g.

```typescript
type Resource = {
  someString: string,
  maybeNumber: number | null, 
};

const testResource: Resource = {
  someString: 'some realish looking data',
  maybeNumber: 6,
};

const testResource: Resource = {
  someString: 'some realish looking data',
  maybeNumber: null,
};

describe('an api', () => {
  it('returns what I was expecting', () => {
    return fetch('/resources/1').then(response => response.json()).then((data) => {
      expect(data).toMatchShapeOf(testResource);  
    });            
  });
  
  it('could return a couple of different things', () => {
    return fetch('/resources/1').then(response => response.json()).then((data) => {
      expect(data).toMatchOneOf([testResource, testResourceAlt]);  
    });    
  })
})

```