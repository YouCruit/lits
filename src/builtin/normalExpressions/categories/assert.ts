import { AssertionError } from '../../../errors'
import { Any } from '../../../interface'
import { compare, deepEqual } from '../../../utils'
import { BuiltinNormalExpressions } from '../../interface'
import { any, assertNumberOfParams, litsFunction, string } from '../../../utils/assertion'

export const assertNormalExpression: BuiltinNormalExpressions = {
  assert: {
    evaluate: (params, debugInfo): Any => {
      const value = params[0]
      const message = params.length === 2 ? params[1] : `${value}`
      string.assert(message, debugInfo)
      if (!value) {
        throw new AssertionError(message, debugInfo)
      }
      return any.as(value, debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  'assert=': {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== second) {
        throw new AssertionError(`Expected ${first} to be ${second}.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assertNot=': {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first === second) {
        throw new AssertionError(`Expected ${first} not to be ${second}.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertEqual: {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (!deepEqual(any.as(first, debugInfo), any.as(second, debugInfo), debugInfo)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(first)} to deep equal ${JSON.stringify(second)}.${message}`,
          debugInfo,
        )
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertNotEqual: {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (deepEqual(any.as(first, debugInfo), any.as(second, debugInfo), debugInfo)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(first)} not to deep equal ${JSON.stringify(second)}.${message}`,
          debugInfo,
        )
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert>': {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) <= 0) {
        throw new AssertionError(`Expected ${first} to be grater than ${second}.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert>=': {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) < 0) {
        throw new AssertionError(`Expected ${first} to be grater than or equal to ${second}.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert<': {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) >= 0) {
        throw new AssertionError(`Expected ${first} to be less than ${second}.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'assert<=': {
    evaluate: ([first, second, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (compare(first, second) > 0) {
        throw new AssertionError(`Expected ${first} to be less than or equal to ${second}.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertTrue: {
    evaluate: ([first, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== true) {
        throw new AssertionError(`Expected ${first} to be true.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertFalse: {
    evaluate: ([first, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== false) {
        throw new AssertionError(`Expected ${first} to be false.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertTruthy: {
    evaluate: ([first, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (!first) {
        throw new AssertionError(`Expected ${first} to be truthy.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertFalsy: {
    evaluate: ([first, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first) {
        throw new AssertionError(`Expected ${first} to be falsy.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertNil: {
    evaluate: ([first, message], debugInfo): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      if (first !== null) {
        throw new AssertionError(`Expected ${first} to be nil.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertThrows: {
    evaluate: ([func, message], debugInfo, contextStack, { executeFunction }): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      litsFunction.assert(func, debugInfo)
      try {
        executeFunction(func, [], debugInfo, contextStack)
      } catch {
        return null
      }
      throw new AssertionError(`Expected function to throw.${message}`, debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  assertThrowsError: {
    evaluate: ([func, throwMessage, message], debugInfo, contextStack, { executeFunction }): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      string.assert(throwMessage, debugInfo)
      litsFunction.assert(func, debugInfo)
      try {
        executeFunction(func, [], debugInfo, contextStack)
      } catch (error) {
        expect((error as Error).message).toBe(throwMessage)
        return null
      }
      throw new AssertionError(`Expected function to throw "${throwMessage}".${message}`, debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  assertNotThrows: {
    evaluate: ([func, message], debugInfo, contextStack, { executeFunction }): null => {
      message = typeof message === `string` && message ? ` "${message}"` : ``
      litsFunction.assert(func, debugInfo)
      try {
        executeFunction(func, [], debugInfo, contextStack)
      } catch {
        throw new AssertionError(`Expected function not to throw.${message}`, debugInfo)
      }
      return null
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
}
