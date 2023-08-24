import type { LitsFunction } from '../../..'
import type { ContextStack } from '../../../evaluator/ContextStack'
import type { ExecuteFunction } from '../../../evaluator/interface'
import type { Any, Arr, Coll, Obj } from '../../../interface'
import type { DebugInfo } from '../../../tokenizer/interface'
import { toNonNegativeInteger, toAny, collHasKey, cloneColl } from '../../../utils'

import { assertLitsFunction } from '../../../typeGuards/litsFunction'

import type { BuiltinNormalExpressions } from '../../interface'
import { assertArray } from '../../../typeGuards/array'
import { asColl, assertObj, isObj, assertColl, isColl, isSeq, assertSeq, assertAny } from '../../../typeGuards/lits'
import { assertNumber, isNumber } from '../../../typeGuards/number'
import { assertString, asString, assertStringOrNumber, isString, asStringOrNumber } from '../../../typeGuards/string'
import { assertNumberOfParams } from '../../../typeGuards'

type CollMeta = {
  coll: Coll
  parent: Obj | Arr
}

function cloneAndGetMeta(
  originalColl: Coll,
  keys: Arr,
  debugInfo?: DebugInfo,
): { coll: Coll; innerCollMeta: CollMeta } {
  const coll = cloneColl(originalColl)

  const butLastKeys = keys.slice(0, keys.length - 1)

  const innerCollMeta = butLastKeys.reduce(
    (result: CollMeta, key) => {
      const resultColl = result.coll

      let newResultColl: Coll
      if (Array.isArray(resultColl)) {
        assertNumber(key, debugInfo)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newResultColl = asColl(resultColl[key], debugInfo)
      } else {
        assertObj(resultColl, debugInfo)
        assertString(key, debugInfo)
        if (!collHasKey(result.coll, key)) {
          resultColl[key] = {}
        }
        newResultColl = asColl(resultColl[key], debugInfo)
      }

      return { coll: newResultColl, parent: resultColl }
    },
    { coll, parent: {} },
  )
  return { coll, innerCollMeta }
}

function get(coll: Coll, key: string | number): Any | undefined {
  if (isObj(coll)) {
    if (typeof key === `string` && collHasKey(coll, key)) {
      return toAny(coll[key])
    }
  } else {
    if (isNumber(key, { nonNegative: true, integer: true }) && key >= 0 && key < coll.length) {
      return toAny(coll[key])
    }
  }
  return undefined
}

function update(
  coll: Coll,
  key: string | number,
  fn: LitsFunction,
  params: Arr,
  contextStack: ContextStack,
  executeFunction: ExecuteFunction,
  debugInfo?: DebugInfo,
): Coll {
  if (isObj(coll)) {
    assertString(key, debugInfo)
    const result = { ...coll }
    result[key] = executeFunction(fn, [result[key], ...params], contextStack, debugInfo)
    return result
  } else {
    assertNumber(key, debugInfo)
    const intKey = toNonNegativeInteger(key)
    assertNumber(intKey, debugInfo, { lte: coll.length })
    if (Array.isArray(coll)) {
      const result = coll.map((elem, index) => {
        if (intKey === index) {
          return executeFunction(fn, [elem, ...params], contextStack, debugInfo)
        }
        return elem
      })
      if (intKey === coll.length) {
        result[intKey] = executeFunction(fn, [undefined, ...params], contextStack, debugInfo)
      }
      return result
    } else {
      const result = coll.split(``).map((elem, index) => {
        if (intKey === index) {
          return asString(executeFunction(fn, [elem, ...params], contextStack, debugInfo), debugInfo, {
            char: true,
          })
        }
        return elem
      })
      if (intKey === coll.length) {
        result[intKey] = asString(executeFunction(fn, [undefined, ...params], contextStack, debugInfo), debugInfo, {
          char: true,
        })
      }
      return result.join(``)
    }
  }
}

function assoc(coll: Coll, key: string | number, value: Any, debugInfo?: DebugInfo) {
  assertColl(coll, debugInfo)
  assertStringOrNumber(key, debugInfo)
  if (Array.isArray(coll) || typeof coll === `string`) {
    assertNumber(key, debugInfo, { integer: true })
    assertNumber(key, debugInfo, { gte: 0 })
    assertNumber(key, debugInfo, { lte: coll.length })
    if (typeof coll === `string`) {
      assertString(value, debugInfo, { char: true })
      return `${coll.slice(0, key)}${value}${coll.slice(key + 1)}`
    }
    const copy = [...coll]
    copy[key] = value
    return copy
  }
  assertString(key, debugInfo)
  const copy = { ...coll }
  copy[key] = value
  return copy
}

export const collectionNormalExpression: BuiltinNormalExpressions = {
  get: {
    evaluate: (params, debugInfo) => {
      const [coll, key] = params
      const defaultValue = toAny(params[2])
      assertStringOrNumber(key, debugInfo)
      if (coll === null) {
        return defaultValue
      }
      assertColl(coll, debugInfo)
      const result = get(coll, key)
      return result === undefined ? defaultValue : result
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'get-in': {
    evaluate: (params, debugInfo): Any => {
      let coll = toAny(params[0])
      const keys = params[1] ?? [] // nil behaves as empty array
      const defaultValue = toAny(params[2])
      assertArray(keys, debugInfo)
      for (const key of keys) {
        assertStringOrNumber(key, debugInfo)
        if (isColl(coll)) {
          const nextValue = get(coll, key)
          if (nextValue !== undefined) {
            coll = nextValue
          } else {
            return defaultValue
          }
        } else {
          return defaultValue
        }
      }
      return coll
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  count: {
    evaluate: ([coll], debugInfo): number => {
      if (typeof coll === `string`) {
        return coll.length
      }
      assertColl(coll, debugInfo)
      if (Array.isArray(coll)) {
        return coll.length
      }
      return Object.keys(coll).length
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'contains?': {
    evaluate: ([coll, key], debugInfo): boolean => {
      assertColl(coll, debugInfo)
      assertStringOrNumber(key, debugInfo)
      if (isSeq(coll)) {
        if (!isNumber(key, { integer: true })) {
          return false
        }
        assertNumber(key, debugInfo, { integer: true })
        return key >= 0 && key < coll.length
      }
      return !!Object.getOwnPropertyDescriptor(coll, key)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'has?': {
    evaluate: ([coll, value], debugInfo): boolean => {
      assertColl(coll, debugInfo)
      if (Array.isArray(coll)) {
        return coll.includes(value)
      }
      if (typeof coll === `string`) {
        return typeof value === `string` ? coll.split(``).includes(value) : false
      }
      return Object.values(coll).includes(value)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'has-some?': {
    evaluate: ([coll, seq], debugInfo): boolean => {
      assertColl(coll, debugInfo)
      assertSeq(seq, debugInfo)
      if (Array.isArray(coll)) {
        for (const value of seq) {
          if (coll.includes(value)) {
            return true
          }
        }
        return false
      }
      if (typeof coll === `string`) {
        for (const value of seq) {
          if (isString(value, { char: true }) ? coll.split(``).includes(value) : false) {
            return true
          }
        }
        return false
      }
      for (const value of seq) {
        if (Object.values(coll).includes(value)) {
          return true
        }
      }
      return false
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'has-every?': {
    evaluate: ([coll, seq], debugInfo): boolean => {
      assertColl(coll, debugInfo)
      assertSeq(seq, debugInfo)
      if (Array.isArray(coll)) {
        for (const value of seq) {
          if (!coll.includes(value)) {
            return false
          }
        }
        return true
      }
      if (typeof coll === `string`) {
        for (const value of seq) {
          if (!isString(value, { char: true }) || !coll.split(``).includes(value)) {
            return false
          }
        }
        return true
      }
      for (const value of seq) {
        if (!Object.values(coll).includes(value)) {
          return false
        }
      }
      return true
    },
    validate: node => assertNumberOfParams(2, node),
  },
  assoc: {
    evaluate: ([coll, key, value], debugInfo): Coll => {
      assertColl(coll, debugInfo)
      assertStringOrNumber(key, debugInfo)
      assertAny(value, debugInfo)
      return assoc(coll, key, value, debugInfo)
    },
    validate: node => assertNumberOfParams(3, node),
  },
  'assoc-in': {
    evaluate: ([originalColl, keys, value], debugInfo): Coll => {
      assertColl(originalColl, debugInfo)
      assertArray(keys, debugInfo)
      assertAny(value, debugInfo)

      if (keys.length === 1) {
        assertStringOrNumber(keys[0], debugInfo)
        return assoc(originalColl, keys[0], value, debugInfo)
      }

      const { coll, innerCollMeta } = cloneAndGetMeta(originalColl, keys, debugInfo)

      const lastKey = asStringOrNumber(keys[keys.length - 1], debugInfo)
      const parentKey = asStringOrNumber(keys[keys.length - 2], debugInfo)

      if (Array.isArray(innerCollMeta.parent)) {
        assertNumber(parentKey, debugInfo)
        innerCollMeta.parent[parentKey] = assoc(innerCollMeta.coll, lastKey, value, debugInfo)
      } else {
        assertString(parentKey, debugInfo)
        innerCollMeta.parent[parentKey] = assoc(innerCollMeta.coll, lastKey, value, debugInfo)
      }

      return coll
    },
    validate: node => assertNumberOfParams(3, node),
  },
  update: {
    evaluate: ([coll, key, fn, ...params], debugInfo, contextStack, { executeFunction }): Coll => {
      assertColl(coll, debugInfo)
      assertStringOrNumber(key, debugInfo)
      assertLitsFunction(fn, debugInfo)
      return update(coll, key, fn, params, contextStack, executeFunction, debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 3 }, node),
  },
  'update-in': {
    evaluate: ([originalColl, keys, fn, ...params], debugInfo, contextStack, { executeFunction }): Coll => {
      assertColl(originalColl, debugInfo)
      assertArray(keys, debugInfo)
      assertLitsFunction(fn, debugInfo)

      if (keys.length === 1) {
        assertStringOrNumber(keys[0], debugInfo)
        return update(originalColl, keys[0], fn, params, contextStack, executeFunction, debugInfo)
      }

      const { coll, innerCollMeta } = cloneAndGetMeta(originalColl, keys, debugInfo)

      const lastKey = asStringOrNumber(keys[keys.length - 1], debugInfo)
      const parentKey = asStringOrNumber(keys[keys.length - 2], debugInfo)

      if (Array.isArray(innerCollMeta.parent)) {
        assertNumber(parentKey, debugInfo)
        innerCollMeta.parent[parentKey] = update(
          innerCollMeta.coll,
          lastKey,
          fn,
          params,
          contextStack,
          executeFunction,
          debugInfo,
        )
      } else {
        assertString(parentKey, debugInfo)
        innerCollMeta.parent[parentKey] = update(
          innerCollMeta.coll,
          lastKey,
          fn,
          params,
          contextStack,
          executeFunction,
          debugInfo,
        )
      }

      return coll
    },
    validate: node => assertNumberOfParams({ min: 3 }, node),
  },
  concat: {
    evaluate: (params, debugInfo): Any => {
      assertColl(params[0], debugInfo)
      if (Array.isArray(params[0])) {
        return params.reduce((result: Arr, arr) => {
          assertArray(arr, debugInfo)
          return result.concat(arr)
        }, [])
      } else if (isString(params[0])) {
        return params.reduce((result: string, s) => {
          assertString(s, debugInfo)
          return `${result}${s}`
        }, ``)
      } else {
        return params.reduce((result: Obj, obj) => {
          assertObj(obj, debugInfo)
          return Object.assign(result, obj)
        }, {})
      }
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  'not-empty': {
    evaluate: ([coll], debugInfo): Coll | null => {
      assertColl(coll, debugInfo)
      if (typeof coll === `string`) {
        return coll.length > 0 ? coll : null
      }
      if (Array.isArray(coll)) {
        return coll.length > 0 ? coll : null
      }
      return Object.keys(coll).length > 0 ? coll : null
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'every?': {
    evaluate: ([fn, coll], debugInfo, contextStack, { executeFunction }): boolean => {
      assertLitsFunction(fn, debugInfo)
      assertColl(coll, debugInfo)

      if (Array.isArray(coll)) {
        return coll.every(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      if (typeof coll === `string`) {
        return coll.split(``).every(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      return Object.entries(coll).every(elem => executeFunction(fn, [elem], contextStack, debugInfo))
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'any?': {
    evaluate: ([fn, coll], debugInfo, contextStack, { executeFunction }): boolean => {
      assertLitsFunction(fn, debugInfo)
      assertColl(coll, debugInfo)

      if (Array.isArray(coll)) {
        return coll.some(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      if (typeof coll === `string`) {
        return coll.split(``).some(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      return Object.entries(coll).some(elem => executeFunction(fn, [elem], contextStack, debugInfo))
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'not-any?': {
    evaluate: ([fn, coll], debugInfo, contextStack, { executeFunction }): boolean => {
      assertLitsFunction(fn, debugInfo)
      assertColl(coll, debugInfo)

      if (Array.isArray(coll)) {
        return !coll.some(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      if (typeof coll === `string`) {
        return !coll.split(``).some(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      return !Object.entries(coll).some(elem => executeFunction(fn, [elem], contextStack, debugInfo))
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'not-every?': {
    evaluate: ([fn, coll], debugInfo, contextStack, { executeFunction }): boolean => {
      assertLitsFunction(fn, debugInfo)
      assertColl(coll, debugInfo)

      if (Array.isArray(coll)) {
        return !coll.every(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      if (typeof coll === `string`) {
        return !coll.split(``).every(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      return !Object.entries(coll).every(elem => executeFunction(fn, [elem], contextStack, debugInfo))
    },
    validate: node => assertNumberOfParams(2, node),
  },
}
