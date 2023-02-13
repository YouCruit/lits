import { DataType } from '../../../analyze/dataTypes/DataType'
import { assertNumberOfParams } from '../../../utils/assertion'
import { number } from '../../../utils/numberAssertion'
import { BuiltinNormalExpressions } from '../../interface'

export const bitwiseNormalExpression: BuiltinNormalExpressions = {
  'bit-shift-left': {
    evaluate: ([num, count], debugInfo): number => {
      number.assert(num, debugInfo, { integer: true })
      number.assert(count, debugInfo, { integer: true, nonNegative: true })

      return num << count
    },
    validate: node => assertNumberOfParams(2, node),
    getDataType: () => DataType.number,
  },
  'bit-shift-right': {
    evaluate: ([num, count], debugInfo): number => {
      number.assert(num, debugInfo, { integer: true })
      number.assert(count, debugInfo, { integer: true, nonNegative: true })

      return num >> count
    },
    validate: node => assertNumberOfParams(2, node),
    getDataType: () => DataType.number,
  },
  'bit-not': {
    evaluate: ([num], debugInfo): number => {
      number.assert(num, debugInfo, { integer: true })
      return ~num
    },
    validate: node => assertNumberOfParams(1, node),
    getDataType: () => DataType.number,
  },
  'bit-and': {
    evaluate: ([first, ...rest], debugInfo): number => {
      number.assert(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, debugInfo, { integer: true })
        return result & value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
    getDataType: () => DataType.number,
  },
  'bit-and-not': {
    evaluate: ([first, ...rest], debugInfo): number => {
      number.assert(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, debugInfo, { integer: true })
        return result & ~value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
    getDataType: () => DataType.number,
  },
  'bit-or': {
    evaluate: ([first, ...rest], debugInfo): number => {
      number.assert(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, debugInfo, { integer: true })
        return result | value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
    getDataType: () => DataType.number,
  },
  'bit-xor': {
    evaluate: ([first, ...rest], debugInfo): number => {
      number.assert(first, debugInfo, { integer: true })

      return rest.reduce((result: number, value) => {
        number.assert(value, debugInfo, { integer: true })
        return result ^ value
      }, first)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
    getDataType: () => DataType.number,
  },
  'bit-flip': {
    evaluate: ([num, index], debugInfo): number => {
      number.assert(num, debugInfo, { integer: true })
      number.assert(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return (num ^= mask)
    },
    validate: node => assertNumberOfParams(2, node),
    getDataType: () => DataType.number,
  },
  'bit-set': {
    evaluate: ([num, index], debugInfo): number => {
      number.assert(num, debugInfo, { integer: true })
      number.assert(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return (num |= mask)
    },
    validate: node => assertNumberOfParams(2, node),
    getDataType: () => DataType.number,
  },
  'bit-clear': {
    evaluate: ([num, index], debugInfo): number => {
      number.assert(num, debugInfo, { integer: true })
      number.assert(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return (num &= ~mask)
    },
    validate: node => assertNumberOfParams(2, node),
    getDataType: () => DataType.number,
  },
  'bit-test': {
    evaluate: ([num, index], debugInfo): boolean => {
      number.assert(num, debugInfo, { integer: true })
      number.assert(index, debugInfo, { integer: true, nonNegative: true })

      const mask = 1 << index
      return !!(num & mask)
    },
    validate: node => assertNumberOfParams(2, node),
    getDataType: () => DataType.boolean,
  },
}
