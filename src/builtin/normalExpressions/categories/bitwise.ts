import { assertLength, assertNonNegativeInteger } from '../../../utils'
import { number } from '../../../utils/numberAssertion'
import { BuiltinNormalExpressions } from '../../interface'

export const bitwiseNormalExpression: BuiltinNormalExpressions = {
  'bit-shift-left': {
    evaluate: ([num, count], sourceCodeInfo): number => {
      number.assert(num, sourceCodeInfo, { integer: true })
      assertNonNegativeInteger(count, sourceCodeInfo)

      return num << count
    },
    validate: node => assertLength(2, node),
  },
  'bit-shift-right': {
    evaluate: ([num, count], sourceCodeInfo): number => {
      number.assert(num, sourceCodeInfo, { integer: true })
      assertNonNegativeInteger(count, sourceCodeInfo)

      return num >> count
    },
    validate: node => assertLength(2, node),
  },
  'bit-not': {
    evaluate: ([num], sourceCodeInfo): number => {
      number.assert(num, sourceCodeInfo, { integer: true })
      return ~num
    },
    validate: node => assertLength(1, node),
  },
  'bit-and': {
    evaluate: ([first, ...rest], sourceCodeInfo): number => {
      number.assert(first, sourceCodeInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, sourceCodeInfo, { integer: true })
        return result & value
      }, first)
    },
    validate: node => assertLength({ min: 2 }, node),
  },
  'bit-and-not': {
    evaluate: ([first, ...rest], sourceCodeInfo): number => {
      number.assert(first, sourceCodeInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, sourceCodeInfo, { integer: true })
        return result & ~value
      }, first)
    },
    validate: node => assertLength({ min: 2 }, node),
  },
  'bit-or': {
    evaluate: ([first, ...rest], sourceCodeInfo): number => {
      number.assert(first, sourceCodeInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, sourceCodeInfo, { integer: true })
        return result | value
      }, first)
    },
    validate: node => assertLength({ min: 2 }, node),
  },
  'bit-xor': {
    evaluate: ([first, ...rest], sourceCodeInfo): number => {
      number.assert(first, sourceCodeInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, sourceCodeInfo, { integer: true })
        return result ^ value
      }, first)
    },
    validate: node => assertLength({ min: 2 }, node),
  },
  'bit-flip': {
    evaluate: ([num, index], sourceCodeInfo): number => {
      number.assert(num, sourceCodeInfo, { integer: true })
      assertNonNegativeInteger(index, sourceCodeInfo)

      const mask = 1 << index
      return (num ^= mask)
    },
    validate: node => assertLength(2, node),
  },
  'bit-set': {
    evaluate: ([num, index], sourceCodeInfo): number => {
      number.assert(num, sourceCodeInfo, { integer: true })
      assertNonNegativeInteger(index, sourceCodeInfo)

      const mask = 1 << index
      return (num |= mask)
    },
    validate: node => assertLength(2, node),
  },
  'bit-clear': {
    evaluate: ([num, index], sourceCodeInfo): number => {
      number.assert(num, sourceCodeInfo, { integer: true })
      assertNonNegativeInteger(index, sourceCodeInfo)

      const mask = 1 << index
      return (num &= ~mask)
    },
    validate: node => assertLength(2, node),
  },
  'bit-test': {
    evaluate: ([num, index], sourceCodeInfo): boolean => {
      number.assert(num, sourceCodeInfo, { integer: true })
      assertNonNegativeInteger(index, sourceCodeInfo)

      const mask = 1 << index
      return !!(num & mask)
    },
    validate: node => assertLength(2, node),
  },
}
