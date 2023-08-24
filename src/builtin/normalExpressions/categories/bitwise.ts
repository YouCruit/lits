import { assertNumber, assertNumberOfParams } from '../../../utils/assertion'
import type { BuiltinNormalExpressions } from '../../interface'

export const bitwiseNormalExpression: BuiltinNormalExpressions = {
  'bit-shift-left': {
    evaluate: ([num, count], debugInfo): number => {
      assertNumber(num, debugInfo, { integer: true })
      assertNumber(count, debugInfo, { integer: true, nonNegative: true })

      return num << count
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'bit-shift-right': {
    evaluate: ([num, count], debugInfo): number => {
      assertNumber(num, debugInfo, { integer: true })
      assertNumber(count, debugInfo, { integer: true, nonNegative: true })

      return num >> count
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'bit-not': {
    evaluate: ([num], debugInfo): number => {
      assertNumber(num, debugInfo, { integer: true })
      return ~num
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'bit-and': {
    evaluate: ([first, ...rest], debugInfo): number => {
      assertNumber(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        assertNumber(value, debugInfo, { integer: true })
        return result & value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  'bit-and-not': {
    evaluate: ([first, ...rest], debugInfo): number => {
      assertNumber(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        assertNumber(value, debugInfo, { integer: true })
        return result & ~value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  'bit-or': {
    evaluate: ([first, ...rest], debugInfo): number => {
      assertNumber(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        assertNumber(value, debugInfo, { integer: true })
        return result | value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  'bit-xor': {
    evaluate: ([first, ...rest], debugInfo): number => {
      assertNumber(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        assertNumber(value, debugInfo, { integer: true })
        return result ^ value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
  'bit-flip': {
    evaluate: ([num, index], debugInfo): number => {
      assertNumber(num, debugInfo, { integer: true })
      assertNumber(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return (num ^= mask)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'bit-set': {
    evaluate: ([num, index], debugInfo): number => {
      assertNumber(num, debugInfo, { integer: true })
      assertNumber(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return (num |= mask)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'bit-clear': {
    evaluate: ([num, index], debugInfo): number => {
      assertNumber(num, debugInfo, { integer: true })
      assertNumber(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return (num &= ~mask)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'bit-test': {
    evaluate: ([num, index], debugInfo): boolean => {
      assertNumber(num, debugInfo, { integer: true })
      assertNumber(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return !!(num & mask)
    },
    validate: node => assertNumberOfParams(2, node),
  },
}
