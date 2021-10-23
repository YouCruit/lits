import { Any, Arr, Coll, Obj } from '../../../interface'
import {
  assertArr,
  assertChar,
  assertColl,
  assertInteger,
  assertLength,
  assertLispishFunction,
  assertMax,
  assertNumber,
  assertNumberGte,
  assertNumberLte,
  assertObj,
  assertString,
  assertStringOrNumber,
  isArr,
  isObj,
  isSeq,
  isString,
  toNonNegativeInteger,
  toAny,
  asChar,
  collHasKey,
  isColl,
  isAny,
  clone,
  asColl,
} from '../../../utils'
import { BuiltinNormalExpressions } from '../../interface'

function get(coll: Coll, key: string | number): Any | undefined {
  if (isArr(coll)) {
    assertInteger(key)
    if (key < coll.length) {
      return toAny(coll[key])
    }
  } else if (isObj(coll)) {
    assertString(key)
    if (collHasKey(coll, key)) {
      return toAny(coll[key])
    }
  } else {
    assertInteger(key)
    if (key < coll.length) {
      return toAny(coll[key])
    }
  }
  return undefined
}

export const collectionNormalExpression: BuiltinNormalExpressions = {
  get: {
    evaluate: (params: Arr): Any => {
      const [coll, key] = params
      const defaultValue = toAny(params[2])
      assertColl(coll)
      assertStringOrNumber(key)
      const result = get(coll, key)
      return result === undefined ? defaultValue : result
    },
    validate: node => assertLength({ min: 2, max: 3 }, node),
  },
  'get-in': {
    evaluate: (params: Arr): Any => {
      let coll = params[0]
      const keys = params[1]
      const defaultValue = toAny(params[2])
      assertColl(coll)
      assertArr(keys)
      for (const key of keys) {
        assertStringOrNumber(key)
        if (isColl(coll)) {
          coll = get(coll, key)
        } else {
          return defaultValue
        }
      }
      return isAny(coll) ? coll : defaultValue
    },
    validate: node => assertLength({ min: 2, max: 3 }, node),
  },
  count: {
    evaluate: ([coll]): number => {
      if (typeof coll === `string`) {
        return coll.length
      }
      assertColl(coll)
      if (Array.isArray(coll)) {
        return coll.length
      }
      return Object.keys(coll).length
    },
    validate: node => assertLength(1, node),
  },
  'contains?': {
    evaluate: ([coll, key]): boolean => {
      assertColl(coll)
      assertStringOrNumber(key)
      if (isSeq(coll)) {
        if (!Number.isInteger(key)) {
          return false
        }
        assertInteger(key)
        return key >= 0 && key < coll.length
      }
      return !!Object.getOwnPropertyDescriptor(coll, key)
    },
    validate: node => assertLength(2, node),
  },
  'has?': {
    evaluate: ([coll, value]): boolean => {
      assertColl(coll)
      if (isArr(coll)) {
        return coll.includes(value)
      }
      if (isString(coll)) {
        return isString(value) ? coll.split(``).includes(value) : false
      }
      return Object.values(coll).includes(value)
    },
    validate: node => assertLength(2, node),
  },
  assoc: {
    evaluate: ([coll, key, value]): Coll => {
      assertColl(coll)
      assertStringOrNumber(key)
      if (Array.isArray(coll) || typeof coll === `string`) {
        assertInteger(key)
        assertNumberGte(key, 0)
        assertNumberLte(key, coll.length)
        if (typeof coll === `string`) {
          assertChar(value)
          return `${coll.slice(0, key)}${value}${coll.slice(key + 1)}`
        }
        const copy = [...coll]
        copy[key] = value
        return copy
      }
      assertString(key)
      const copy = { ...coll }
      copy[key] = value
      return copy
    },
    validate: node => assertLength(3, node),
  },
  'assoc-in': {
    evaluate: ([originalColl, keys, value]): Coll => {
      assertColl(originalColl)
      assertArr(keys)
      const coll = clone(originalColl)

      const butLastKeys = keys.slice(0, keys.length - 1)
      const lastKey = keys[keys.length - 1]
      const parentKey = keys[keys.length - 2]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parentColl: any
      const innerColl = butLastKeys.reduce((result: Coll, key) => {
        parentColl = result

        let innerColl: Coll
        if (isArr(result)) {
          assertNumber(key)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          innerColl = asColl(result[key])
        } else {
          assertObj(result)
          assertString(key)
          if (!collHasKey(result, key)) {
            result[key] = {}
          }
          innerColl = asColl(result[key])
        }

        return innerColl
      }, coll)

      if (isArr(innerColl)) {
        assertNumber(lastKey)
        innerColl[lastKey] = value
      } else if (isString(innerColl)) {
        assertNumber(lastKey)
        assertChar(value)
        const newString = `${innerColl.substring(0, lastKey)}${value}${innerColl.substring(lastKey + 1)}`
        if (isArr(parentColl)) {
          assertNumber(parentKey)
          parentColl[parentKey] = newString
        } else {
          assertObj(parentColl)
          assertString(parentKey)
          parentColl[parentKey] = newString
        }
      } else {
        assertString(lastKey)
        innerColl[lastKey] = value
      }

      return coll
    },
    validate: node => assertLength(3, node),
  },
  concat: {
    evaluate: (params: Arr): Any => {
      assertColl(params[0])
      if (isArr(params[0])) {
        return params.reduce((result: Arr, arr) => {
          assertArr(arr)
          return result.concat(arr)
        }, [])
      } else if (isString(params[0])) {
        return params.reduce((result: string, s) => {
          assertString(s)
          return `${result}${s}`
        }, ``)
      } else {
        return params.reduce((result: Obj, obj) => {
          assertObj(obj)
          return Object.assign(result, obj)
        }, {})
      }
    },
    validate: node => assertLength({ min: 1 }, node),
  },
  'empty?': {
    evaluate: ([first]): boolean => {
      assertColl(first)
      if (isString(first)) {
        return first.length === 0
      }
      if (Array.isArray(first)) {
        return first.length === 0
      }
      return Object.keys(first).length === 0
    },
    validate: node => assertLength(1, node),
  },
  'every?': {
    evaluate: ([fn, coll], contextStack, { executeFunction }): boolean => {
      assertLispishFunction(fn)
      assertColl(coll)

      if (Array.isArray(coll)) {
        return coll.every(elem => executeFunction(fn, [elem], contextStack))
      }
      if (isString(coll)) {
        return coll.split(``).every(elem => executeFunction(fn, [elem], contextStack))
      }
      return Object.entries(coll).every(elem => executeFunction(fn, [elem], contextStack))
    },
    validate: node => assertLength(2, node),
  },
  'any?': {
    evaluate: ([fn, coll], contextStack, { executeFunction }): boolean => {
      assertLispishFunction(fn)
      assertColl(coll)

      if (Array.isArray(coll)) {
        return coll.some(elem => executeFunction(fn, [elem], contextStack))
      }
      if (isString(coll)) {
        return coll.split(``).some(elem => executeFunction(fn, [elem], contextStack))
      }
      return Object.entries(coll).some(elem => executeFunction(fn, [elem], contextStack))
    },
    validate: node => assertLength(2, node),
  },
  'not-any?': {
    evaluate: ([fn, coll], contextStack, { executeFunction }): boolean => {
      assertLispishFunction(fn)
      assertColl(coll)

      if (Array.isArray(coll)) {
        return !coll.some(elem => executeFunction(fn, [elem], contextStack))
      }
      if (isString(coll)) {
        return !coll.split(``).some(elem => executeFunction(fn, [elem], contextStack))
      }
      return !Object.entries(coll).some(elem => executeFunction(fn, [elem], contextStack))
    },
    validate: node => assertLength(2, node),
  },
  'not-every?': {
    evaluate: ([fn, coll], contextStack, { executeFunction }): boolean => {
      assertLispishFunction(fn)
      assertColl(coll)

      if (Array.isArray(coll)) {
        return !coll.every(elem => executeFunction(fn, [elem], contextStack))
      }
      if (isString(coll)) {
        return !coll.split(``).every(elem => executeFunction(fn, [elem], contextStack))
      }
      return !Object.entries(coll).every(elem => executeFunction(fn, [elem], contextStack))
    },
    validate: node => assertLength(2, node),
  },
  update: {
    evaluate: ([coll, key, fn, ...params], contextStack, { executeFunction }): Coll => {
      assertColl(coll)
      assertStringOrNumber(key)
      assertLispishFunction(fn)
      if (isObj(coll)) {
        assertString(key)
        const result = { ...coll }
        result[key] = executeFunction(fn, [result[key], ...params], contextStack)
        return result
      } else {
        assertNumber(key)
        const intKey = toNonNegativeInteger(key)
        assertMax(intKey, coll.length)
        if (Array.isArray(coll)) {
          const result = coll.map((elem, index) => {
            if (intKey === index) {
              return executeFunction(fn, [elem, ...params], contextStack)
            }
            return elem
          })
          if (intKey === coll.length) {
            result[intKey] = executeFunction(fn, [undefined, ...params], contextStack)
          }
          return result
        } else {
          const result = coll.split(``).map((elem, index) => {
            if (intKey === index) {
              return asChar(executeFunction(fn, [elem, ...params], contextStack))
            }
            return elem
          })
          if (intKey === coll.length) {
            result[intKey] = asChar(executeFunction(fn, [undefined, ...params], contextStack))
          }
          return result.join(``)
        }
      }
    },
    validate: node => assertLength({ min: 3 }, node),
  },
}
