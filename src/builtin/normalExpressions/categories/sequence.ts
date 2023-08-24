import { LitsError } from '../../../errors'
import type { Any, Arr, Obj, Seq } from '../../../interface'
import type { DebugInfo } from '../../../tokenizer/interface'
import { compare, toAny, toNonNegativeInteger, collHasKey } from '../../../utils'
import { assertLitsFunction } from '../../../typeGuards/litsFunction'
import type { BuiltinNormalExpressions, NormalExpressionEvaluator } from '../../interface'
import { assertArray, assertCharArray, asArray } from '../../../typeGuards/array'
import { assertSeq, assertAny, asAny, asSeq } from '../../../typeGuards/lits'
import { assertNumber, asNumber } from '../../../typeGuards/number'
import { assertString } from '../../../typeGuards/string'
import { assertNumberOfParams } from '../../../typeGuards'

export const evaluateMap: NormalExpressionEvaluator<Arr | string> = (
  params: Arr,
  debugInfo,
  contextStack,
  { executeFunction },
) => {
  const [fn, firstList] = params
  assertLitsFunction(fn, debugInfo)
  assertSeq(firstList, debugInfo)
  const isStringSeq = typeof firstList === `string`

  const length = firstList.length
  if (params.length === 2) {
    if (Array.isArray(firstList)) {
      return firstList.map(elem => executeFunction(fn, [elem], contextStack, debugInfo))
    } else {
      return firstList
        .split(``)
        .map(elem => {
          const newVal = executeFunction(fn, [elem], contextStack, debugInfo)
          assertString(newVal, debugInfo, { char: true })
          return newVal
        })
        .join(``)
    }
  } else {
    params.slice(2).forEach(collParam => {
      if (isStringSeq) {
        assertString(collParam, debugInfo)
      } else {
        assertArray(collParam, debugInfo)
      }
      if (length !== collParam.length) {
        throw new LitsError(`All arguments to "map" must have the same length.`, debugInfo)
      }
    })

    if (isStringSeq) {
      let result = ``
      for (let i = 0; i < length; i += 1) {
        const fnParams = params.slice(1).map(l => (l as string)[i]) as string[]
        const newValue = executeFunction(fn, fnParams, contextStack, debugInfo)
        assertString(newValue, debugInfo, { char: true })
        result += newValue
      }
      return result
    } else {
      const result: Arr = []
      for (let i = 0; i < length; i += 1) {
        const fnParams = params.slice(1).map(l => toAny((l as Arr)[i]))
        result.push(executeFunction(fn, fnParams, contextStack, debugInfo))
      }
      return result
    }
  }
}

export const sequenceNormalExpression: BuiltinNormalExpressions = {
  cons: {
    evaluate: ([elem, seq], debugInfo): Any => {
      assertAny(elem, debugInfo)
      assertSeq(seq, debugInfo)
      if (Array.isArray(seq)) {
        return [elem, ...seq]
      }
      assertString(elem, debugInfo, { char: true })
      return `${elem}${seq}`
    },
    validate: node => assertNumberOfParams(2, node),
  },
  nth: {
    evaluate: (params, debugInfo): Any => {
      const [seq, i] = params
      const defaultValue = toAny(params[2])

      assertNumber(i, debugInfo, { integer: true })

      if (seq === null) {
        return defaultValue
      }
      assertSeq(seq, debugInfo)
      return i >= 0 && i < seq.length ? toAny(seq[i]) : defaultValue
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  filter: {
    evaluate: ([fn, seq]: Arr, debugInfo, contextStack, { executeFunction }): Seq => {
      assertLitsFunction(fn, debugInfo)
      assertSeq(seq, debugInfo)
      if (Array.isArray(seq)) {
        return seq.filter(elem => executeFunction(fn, [elem], contextStack, debugInfo))
      }
      return seq
        .split(``)
        .filter(elem => executeFunction(fn, [elem], contextStack, debugInfo))
        .join(``)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  first: {
    evaluate: ([array], debugInfo): Any => {
      assertSeq(array, debugInfo)
      return toAny(array[0])
    },
    validate: node => assertNumberOfParams(1, node),
  },
  last: {
    evaluate: ([first], debugInfo): Any => {
      assertSeq(first, debugInfo)
      return toAny(first[first.length - 1])
    },
    validate: node => assertNumberOfParams(1, node),
  },
  map: {
    evaluate: evaluateMap,
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  pop: {
    evaluate: ([seq], debugInfo): Seq => {
      assertSeq(seq, debugInfo)
      if (typeof seq === `string`) {
        return seq.substr(0, seq.length - 1)
      }
      const copy = [...seq]
      copy.pop()
      return copy
    },
    validate: node => assertNumberOfParams(1, node),
  },
  position: {
    evaluate: ([fn, seq]: Arr, debugInfo, contextStack, { executeFunction }): number | null => {
      assertLitsFunction(fn, debugInfo)
      assertSeq(seq, debugInfo)
      if (typeof seq === `string`) {
        const index = seq.split(``).findIndex(elem => executeFunction(fn, [elem], contextStack, debugInfo))
        return index !== -1 ? index : null
      } else {
        const index = seq.findIndex(elem => executeFunction(fn, [elem], contextStack, debugInfo))
        return index !== -1 ? index : null
      }
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'index-of': {
    evaluate: ([seq, value], debugInfo): number | null => {
      assertAny(value, debugInfo)
      assertSeq(seq, debugInfo)
      if (typeof seq === `string`) {
        assertString(value, debugInfo)
        const index = seq.indexOf(value)
        return index !== -1 ? index : null
      } else {
        const index = seq.indexOf(value)
        return index !== -1 ? index : null
      }
    },
    validate: node => assertNumberOfParams(2, node),
  },
  push: {
    evaluate: ([seq, ...values], debugInfo): Seq => {
      assertSeq(seq, debugInfo)
      if (typeof seq === `string`) {
        assertCharArray(values, debugInfo)
        return [seq, ...values].join(``)
      } else {
        return [...seq, ...values]
      }
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  reductions: {
    evaluate: (params: Arr, debugInfo, contextStack, { executeFunction }): Any[] => {
      const fn = params[0]
      assertLitsFunction(fn, debugInfo)

      if (params.length === 2) {
        const [, arr] = params
        assertSeq(arr, debugInfo)
        if (arr.length === 0) {
          return [executeFunction(fn, [], contextStack, debugInfo)]
        } else if (arr.length === 1) {
          return [toAny(arr[0])]
        }
        if (typeof arr === `string`) {
          const chars = arr.split(``)
          const resultArray: Any[] = [asAny(chars[0], debugInfo)]
          chars.slice(1).reduce(
            (result: Any, elem) => {
              const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
              resultArray.push(newVal)
              return newVal
            },
            asAny(chars[0], debugInfo),
          )
          return resultArray
        } else {
          const resultArray: Any[] = [toAny(arr[0])]
          arr.slice(1).reduce((result: Any, elem) => {
            const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
            resultArray.push(newVal)
            return newVal
          }, toAny(arr[0]))
          return resultArray
        }
      } else {
        const [, val, seq] = params
        assertAny(val, debugInfo)
        assertSeq(seq, debugInfo)
        if (typeof seq === `string`) {
          assertString(val, debugInfo)
          if (seq.length === 0) {
            return [val]
          }
          const resultArray: Any[] = [val]
          seq.split(``).reduce((result: Any, elem) => {
            const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
            resultArray.push(newVal)
            return newVal
          }, val)
          return resultArray
        } else {
          if (seq.length === 0) {
            return [val]
          }
          const resultArray: Any[] = [val]
          seq.reduce((result: Any, elem) => {
            const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
            resultArray.push(newVal)
            return newVal
          }, val)
          return resultArray
        }
      }
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  reduce: {
    evaluate: (params: Arr, debugInfo, contextStack, { executeFunction }): Any => {
      const fn = params[0]
      assertLitsFunction(fn, debugInfo)

      if (params.length === 2) {
        const [, arr] = params
        assertSeq(arr, debugInfo)
        if (arr.length === 0) {
          return executeFunction(fn, [], contextStack, debugInfo)
        } else if (arr.length === 1) {
          return toAny(arr[0])
        }
        if (typeof arr === `string`) {
          const chars = arr.split(``)
          return chars.slice(1).reduce(
            (result: Any, elem) => {
              const val = executeFunction(fn, [result, elem], contextStack, debugInfo)
              return val
            },
            asAny(chars[0], debugInfo),
          )
        } else {
          return arr.slice(1).reduce((result: Any, elem) => {
            return executeFunction(fn, [result, elem], contextStack, debugInfo)
          }, toAny(arr[0]))
        }
      } else {
        const [, val, seq] = params
        assertAny(val, debugInfo)
        assertSeq(seq, debugInfo)
        if (typeof seq === `string`) {
          assertString(val, debugInfo)
          if (seq.length === 0) {
            return val
          }
          return seq.split(``).reduce((result: Any, elem) => {
            const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
            return newVal
          }, val)
        } else {
          if (seq.length === 0) {
            return val
          }
          return seq.reduce((result: Any, elem) => {
            return executeFunction(fn, [result, elem], contextStack, debugInfo)
          }, val)
        }
      }
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  'reduce-right': {
    evaluate: (params: Arr, debugInfo, contextStack, { executeFunction }): Any => {
      const fn = params[0]
      assertLitsFunction(fn, debugInfo)

      if (params.length === 2) {
        const [, seq] = params
        assertSeq(seq, debugInfo)
        if (seq.length === 0) {
          return executeFunction(fn, [], contextStack, debugInfo)
        } else if (seq.length === 1) {
          return toAny(seq[0])
        }
        if (typeof seq === `string`) {
          const chars = seq.split(``)
          return chars.slice(0, chars.length - 1).reduceRight(
            (result, elem) => {
              const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
              assertString(newVal, debugInfo)
              return newVal
            },
            chars[chars.length - 1] as string,
          )
        } else {
          return seq.slice(0, seq.length - 1).reduceRight(
            (result: Any, elem) => {
              return executeFunction(fn, [result, elem], contextStack, debugInfo)
            },
            asAny(seq[seq.length - 1], debugInfo),
          )
        }
      } else {
        const [, val, seq] = params
        assertAny(val, debugInfo)
        assertSeq(seq, debugInfo)
        if (typeof seq === `string`) {
          if (seq.length === 0) {
            return val
          }
          return seq.split(``).reduceRight((result: Any, elem) => {
            const newVal = executeFunction(fn, [result, elem], contextStack, debugInfo)
            return newVal
          }, val)
        } else {
          if (seq.length === 0) {
            return val
          }
          return seq.reduceRight((result: Any, elem) => {
            return executeFunction(fn, [result, elem], contextStack, debugInfo)
          }, val)
        }
      }
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  rest: {
    evaluate: ([first], debugInfo): Arr | string => {
      assertSeq(first, debugInfo)
      if (Array.isArray(first)) {
        if (first.length <= 1) {
          return []
        }

        return first.slice(1)
      }
      return first.substr(1)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  nthrest: {
    evaluate: ([seq, count], debugInfo): Arr | string => {
      assertSeq(seq, debugInfo)
      assertNumber(count, debugInfo, { finite: true })
      const integerCount = Math.max(Math.ceil(count), 0)
      if (Array.isArray(seq)) {
        return seq.slice(integerCount)
      }
      return seq.substr(integerCount)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  next: {
    evaluate: ([first], debugInfo): Arr | string | null => {
      assertSeq(first, debugInfo)
      if (Array.isArray(first)) {
        if (first.length <= 1) {
          return null
        }

        return first.slice(1)
      }
      if (first.length <= 1) {
        return null
      }
      return first.substr(1)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  nthnext: {
    evaluate: ([seq, count], debugInfo): Arr | string | null => {
      assertSeq(seq, debugInfo)
      assertNumber(count, debugInfo, { finite: true })
      const integerCount = Math.max(Math.ceil(count), 0)
      if (seq.length <= count) {
        return null
      }
      if (Array.isArray(seq)) {
        return seq.slice(integerCount)
      }
      return seq.substr(integerCount)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  reverse: {
    evaluate: ([first], debugInfo): Any => {
      assertSeq(first, debugInfo)
      if (Array.isArray(first)) {
        return [...first].reverse()
      }
      return first.split(``).reverse().join(``)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  second: {
    evaluate: ([array], debugInfo): Any => {
      assertSeq(array, debugInfo)
      return toAny(array[1])
    },
    validate: node => assertNumberOfParams(1, node),
  },
  shift: {
    evaluate: ([seq], debugInfo): Any => {
      assertSeq(seq, debugInfo)
      if (typeof seq === `string`) {
        return seq.substr(1)
      }
      const copy = [...seq]
      copy.shift()
      return copy
    },
    validate: node => assertNumberOfParams(1, node),
  },
  slice: {
    evaluate: (params, debugInfo): Any => {
      const [seq, from, to] = params
      assertSeq(seq, debugInfo)

      if (params.length === 1) {
        return seq
      }

      assertNumber(from, debugInfo, { integer: true })

      if (params.length === 2) {
        return seq.slice(from)
      }

      assertNumber(to, debugInfo, { integer: true })
      return seq.slice(from, to)
    },
    validate: node => assertNumberOfParams({ min: 1, max: 3 }, node),
  },
  some: {
    evaluate: ([fn, seq]: Arr, debugInfo, contextStack, { executeFunction }): Any => {
      assertLitsFunction(fn, debugInfo)
      assertSeq(seq, debugInfo)

      if (seq.length === 0) {
        return null
      }

      if (typeof seq === `string`) {
        return seq.split(``).find(elem => executeFunction(fn, [elem], contextStack, debugInfo)) ?? null
      }

      return toAny(seq.find(elem => executeFunction(fn, [elem], contextStack, debugInfo)))
    },
    validate: node => assertNumberOfParams(2, node),
  },
  sort: {
    evaluate: (params: Arr, debugInfo, contextStack, { executeFunction }): Seq => {
      const defaultComparer = params.length === 1
      const seq = defaultComparer ? params[0] : params[1]
      const comparer = defaultComparer ? null : params[0]
      assertSeq(seq, debugInfo)

      if (typeof seq === `string`) {
        const result = seq.split(``)
        if (defaultComparer) {
          result.sort(compare)
        } else {
          assertLitsFunction(comparer, debugInfo)
          result.sort((a, b) => {
            const compareValue = executeFunction(comparer, [a, b], contextStack, debugInfo)
            assertNumber(compareValue, debugInfo, { finite: true })
            return compareValue
          })
        }
        return result.join(``)
      }

      const result = [...seq]
      if (defaultComparer) {
        result.sort(compare)
      } else {
        result.sort((a, b) => {
          assertLitsFunction(comparer, debugInfo)
          const compareValue = executeFunction(comparer, [a, b], contextStack, debugInfo)
          assertNumber(compareValue, debugInfo, { finite: true })
          return compareValue
        })
      }
      return result
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  'sort-by': {
    evaluate: (params: Arr, debugInfo, contextStack, { executeFunction }): Seq => {
      const defaultComparer = params.length === 2

      const keyfn = asAny(params[0], debugInfo)
      const comparer = defaultComparer ? null : params[1]
      const seq = asSeq(defaultComparer ? params[1] : params[2], debugInfo)

      if (typeof seq === `string`) {
        const result = seq.split(``)
        if (defaultComparer) {
          result.sort((a, b) => {
            const aKey = executeFunction(keyfn, [a], contextStack, debugInfo)
            const bKey = executeFunction(keyfn, [b], contextStack, debugInfo)
            return compare(aKey, bKey)
          })
        } else {
          assertLitsFunction(comparer, debugInfo)
          result.sort((a, b) => {
            const aKey = executeFunction(keyfn, [a], contextStack, debugInfo)
            const bKey = executeFunction(keyfn, [b], contextStack, debugInfo)
            const compareValue = executeFunction(comparer, [aKey, bKey], contextStack, debugInfo)
            assertNumber(compareValue, debugInfo, { finite: true })
            return compareValue
          })
        }
        return result.join(``)
      }

      const result = [...seq]
      if (defaultComparer) {
        result.sort((a, b) => {
          const aKey = executeFunction(keyfn, [a], contextStack, debugInfo)
          const bKey = executeFunction(keyfn, [b], contextStack, debugInfo)
          return compare(aKey, bKey)
        })
      } else {
        assertLitsFunction(comparer, debugInfo)
        result.sort((a, b) => {
          const aKey = executeFunction(keyfn, [a], contextStack, debugInfo)
          const bKey = executeFunction(keyfn, [b], contextStack, debugInfo)
          const compareValue = executeFunction(comparer, [aKey, bKey], contextStack, debugInfo)
          assertNumber(compareValue, debugInfo, { finite: true })
          return compareValue
        })
      }
      return result
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
  take: {
    evaluate: ([n, input], debugInfo): Seq => {
      assertNumber(n, debugInfo)
      assertSeq(input, debugInfo)
      const num = Math.max(Math.ceil(n), 0)
      return input.slice(0, num)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'take-last': {
    evaluate: ([n, array], debugInfo): Seq => {
      assertSeq(array, debugInfo)
      assertNumber(n, debugInfo)
      const num = Math.max(Math.ceil(n), 0)
      const from = array.length - num
      return array.slice(from)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'take-while': {
    evaluate: ([fn, seq]: Arr, debugInfo, contextStack, { executeFunction }): Any => {
      assertSeq(seq, debugInfo)
      assertLitsFunction(fn, debugInfo)

      const result: Arr = []
      for (const item of seq) {
        if (executeFunction(fn, [item], contextStack, debugInfo)) {
          result.push(item)
        } else {
          break
        }
      }
      return typeof seq === `string` ? result.join(``) : result
    },
    validate: node => assertNumberOfParams(2, node),
  },
  drop: {
    evaluate: ([n, input], debugInfo): Seq => {
      assertNumber(n, debugInfo)
      const num = Math.max(Math.ceil(n), 0)
      assertSeq(input, debugInfo)
      return input.slice(num)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'drop-last': {
    evaluate: ([n, array], debugInfo): Seq => {
      assertSeq(array, debugInfo)
      assertNumber(n, debugInfo)
      const num = Math.max(Math.ceil(n), 0)

      const from = array.length - num
      return array.slice(0, from)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'drop-while': {
    evaluate: ([fn, seq]: Arr, debugInfo, contextStack, { executeFunction }): Any => {
      assertSeq(seq, debugInfo)
      assertLitsFunction(fn, debugInfo)

      if (Array.isArray(seq)) {
        const from = seq.findIndex(elem => !executeFunction(fn, [elem], contextStack, debugInfo))
        return seq.slice(from)
      }
      const charArray = seq.split(``)
      const from = charArray.findIndex(elem => !executeFunction(fn, [elem], contextStack, debugInfo))
      return charArray.slice(from).join(``)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  unshift: {
    evaluate: ([seq, ...values], debugInfo): Seq => {
      assertSeq(seq, debugInfo)
      if (typeof seq === `string`) {
        assertCharArray(values, debugInfo)
        return [...values, seq].join(``)
      }
      const copy = [...seq]
      copy.unshift(...values)
      return copy
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  'random-sample!': {
    evaluate: ([prob, seq], debugInfo): Seq => {
      assertNumber(prob, debugInfo, { finite: true })
      assertSeq(seq, debugInfo)

      if (typeof seq === `string`) {
        return seq
          .split(``)
          .filter(() => Math.random() < prob)
          .join(``)
      } else {
        return seq.filter(() => Math.random() < prob)
      }
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'rand-nth!': {
    evaluate: ([seq], debugInfo): Any => {
      assertSeq(seq, debugInfo)
      if (seq.length === 0) {
        return null
      }

      const index = Math.floor(Math.random() * seq.length)

      if (typeof seq === `string`) {
        return toAny(seq.split(``)[index])
      }
      return toAny(seq[index])
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'shuffle!': {
    evaluate: ([input], debugInfo): Seq => {
      assertSeq(input, debugInfo)
      const array: Arr = typeof input === `string` ? [...input.split(``)] : [...input]
      let remainingLength = array.length
      let arrayElement: Any
      let pickedIndex: number

      // Fisher–Yates Shuffle
      while (remainingLength) {
        remainingLength -= 1

        // Pick a remaining element
        pickedIndex = Math.floor(Math.random() * remainingLength)

        // And swap it with the current element.
        arrayElement = toAny(array[remainingLength])
        array[remainingLength] = toAny(array[pickedIndex])
        array[pickedIndex] = arrayElement
      }

      return typeof input === `string` ? array.join(``) : array
    },
    validate: node => assertNumberOfParams(1, node),
  },
  distinct: {
    evaluate: ([input], debugInfo): Seq => {
      assertSeq(input, debugInfo)
      if (Array.isArray(input)) {
        return Array.from(new Set(input))
      }
      return Array.from(new Set(input.split(``))).join(``)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  remove: {
    evaluate: ([fn, input], debugInfo, contextStack, { executeFunction }): Seq => {
      assertLitsFunction(fn, debugInfo)
      assertSeq(input, debugInfo)
      if (Array.isArray(input)) {
        return input.filter(elem => !executeFunction(fn, [elem], contextStack, debugInfo))
      }
      return input
        .split(``)
        .filter(elem => !executeFunction(fn, [elem], contextStack, debugInfo))
        .join(``)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'remove-at': {
    evaluate: ([index, input], debugInfo): Seq => {
      assertNumber(index, debugInfo)
      assertSeq(input, debugInfo)

      const intIndex = Math.ceil(index)
      if (intIndex < 0 || intIndex >= input.length) {
        return input
      }

      if (Array.isArray(input)) {
        const copy = [...input]
        copy.splice(index, 1)
        return copy
      }
      return `${input.substring(0, index)}${input.substring(index + 1)}`
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'split-at': {
    evaluate: ([pos, seq], debugInfo): Seq => {
      assertNumber(pos, debugInfo, { finite: true })
      const intPos = toNonNegativeInteger(pos)
      assertSeq(seq, debugInfo)
      return [seq.slice(0, intPos), seq.slice(intPos)]
    },
    validate: node => assertNumberOfParams(2, node),
  },

  'split-with': {
    evaluate: ([fn, seq], debugInfo, contextStack, { executeFunction }): Seq => {
      assertLitsFunction(fn, debugInfo)
      assertSeq(seq, debugInfo)
      const seqIsArray = Array.isArray(seq)
      const arr = seqIsArray ? seq : seq.split(``)
      const index = arr.findIndex(elem => !executeFunction(fn, [elem], contextStack, debugInfo))
      if (index === -1) {
        return [seq, seqIsArray ? [] : ``]
      }
      return [seq.slice(0, index), seq.slice(index)]
    },
    validate: node => assertNumberOfParams(2, node),
  },

  frequencies: {
    evaluate: ([seq], debugInfo): Obj => {
      assertSeq(seq, debugInfo)

      const arr = typeof seq === `string` ? seq.split(``) : seq

      return arr.reduce((result: Obj, val) => {
        assertString(val, debugInfo)
        if (collHasKey(result, val)) {
          result[val] = (result[val] as number) + 1
        } else {
          result[val] = 1
        }
        return result
      }, {})
    },
    validate: node => assertNumberOfParams(1, node),
  },

  'group-by': {
    evaluate: ([fn, seq], debugInfo, contextStack, { executeFunction }): Obj => {
      assertAny(fn, debugInfo)
      assertSeq(seq, debugInfo)
      const arr = Array.isArray(seq) ? seq : seq.split(``)

      return arr.reduce((result: Obj, val) => {
        const key = executeFunction(fn, [val], contextStack, debugInfo)
        assertString(key, debugInfo)
        if (!collHasKey(result, key)) {
          result[key] = []
        }
        ;(result[key] as Arr).push(val)
        return result
      }, {})
    },
    validate: node => assertNumberOfParams(2, node),
  },

  partition: {
    evaluate: (params, debugInfo): Seq => {
      const len = params.length
      const n = toNonNegativeInteger(asNumber(params[0], debugInfo))
      const seq =
        len === 2 ? asSeq(params[1], debugInfo) : len === 3 ? asSeq(params[2], debugInfo) : asSeq(params[3], debugInfo)
      const step = len >= 3 ? toNonNegativeInteger(asNumber(params[1], debugInfo)) : n
      const pad = len === 4 ? (params[2] === null ? [] : asArray(params[2], debugInfo)) : undefined

      return partition(n, step, seq, pad, debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 2, max: 4 }, node),
  },

  'partition-all': {
    evaluate: (params, debugInfo): Seq => {
      const len = params.length
      const n = toNonNegativeInteger(asNumber(params[0], debugInfo))
      const seq = len === 2 ? asSeq(params[1], debugInfo) : asSeq(params[2], debugInfo)
      const step = len >= 3 ? toNonNegativeInteger(asNumber(params[1], debugInfo)) : n

      return partition(n, step, seq, [], debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },

  'partition-by': {
    evaluate: ([fn, seq], debugInfo, contextStack, { executeFunction }): Seq => {
      assertLitsFunction(fn, debugInfo)
      assertSeq(seq, debugInfo)
      const isStringSeq = typeof seq === `string`
      let oldValue: unknown = undefined

      const result = (isStringSeq ? seq.split(``) : seq).reduce((acc: Arr, elem) => {
        const value = executeFunction(fn, [elem], contextStack, debugInfo)
        if (value !== oldValue) {
          acc.push([])
          oldValue = value
        }
        ;(acc[acc.length - 1] as Arr).push(elem)
        return acc
      }, [])

      return isStringSeq ? result.map(elem => (elem as Arr).join(``)) : result
    },
    validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  },
}

function partition(n: number, step: number, seq: Seq, pad: Arr | undefined, debugInfo?: DebugInfo) {
  assertNumber(step, debugInfo, { positive: true })
  const isStringSeq = typeof seq === `string`

  const result: Arr[] = []
  let start = 0
  outer: while (start < seq.length) {
    const innerArr: Arr = []
    for (let i = start; i < start + n; i += 1) {
      if (i >= seq.length) {
        const padIndex = i - seq.length
        if (!pad) {
          start += step
          continue outer
        }
        if (padIndex >= pad.length) {
          break
        }
        innerArr.push(pad[padIndex])
      } else {
        innerArr.push(seq[i])
      }
    }
    result.push(innerArr)
    start += step
  }
  return isStringSeq ? result.map(x => x.join(``)) : result
}
