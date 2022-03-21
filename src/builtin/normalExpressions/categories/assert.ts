import { AssertionError } from '../../../errors'
import { Any } from '../../../interface'
import { compare, deepEqual } from '../../../utils'
import { BuiltinNormalExpressions } from '../../interface'
import { any, assertNumberOfParams, string } from '../../../utils/assertion'

export const assertNormalExpression: BuiltinNormalExpressions = {
  assert: {
    evaluate: (params, sourceCodeInfo): Any => {
      const value = params[0]
      const message = params.length === 2 ? params[1] : `${value}`
      string.assert(message, sourceCodeInfo)
      if (!value) {
        throw new AssertionError(message, sourceCodeInfo)
      }
      return any.as(value, sourceCodeInfo)
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  'assert=': {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== second) {
        throw new AssertionError(`Expected ${first} to be ${second}.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assertNot=': {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first === second) {
        throw new AssertionError(`Expected ${first} not to be ${second}.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertEqual: {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (!deepEqual(any.as(first, sourceCodeInfo), any.as(second, sourceCodeInfo), sourceCodeInfo)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(first)} to deep equal ${JSON.stringify(second)}.${message}`,
          sourceCodeInfo,
        )
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertNotEqual: {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (deepEqual(any.as(first, sourceCodeInfo), any.as(second, sourceCodeInfo), sourceCodeInfo)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(first)} not to deep equal ${JSON.stringify(second)}.${message}`,
          sourceCodeInfo,
        )
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert>': {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) <= 0) {
        throw new AssertionError(`Expected ${first} to be grater than ${second}.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert>=': {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) < 0) {
        throw new AssertionError(`Expected ${first} to be grater than or equal to ${second}.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert<': {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) >= 0) {
        throw new AssertionError(`Expected ${first} to be less than ${second}.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert<=': {
    evaluate: ([first, second, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) > 0) {
        throw new AssertionError(`Expected ${first} to be less than or equal to ${second}.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertTrue: {
    evaluate: ([first, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== true) {
        throw new AssertionError(`Expected ${first} to be true.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertFalse: {
    evaluate: ([first, message], sourceCodeInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== false) {
        throw new AssertionError(`Expected ${first} to be false.${message}`, sourceCodeInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
}
