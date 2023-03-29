import { asDataType, assertDataType, DataType } from '../../../analyze/dataTypes/DataType'
import { any, assertNumberOfParams } from '../../../utils/assertion'
import { BuiltinNormalExpressions } from '../../interface'

export const typeNormalExpression: BuiltinNormalExpressions = {
  'type-of': {
    evaluate: ([value], debugInfo): DataType => {
      any.assert(value, debugInfo)
      return DataType.of(value)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'type-or': {
    evaluate: (params, debugInfo): DataType => {
      params.forEach(param => assertDataType(param, debugInfo))
      return DataType.or(...(params as DataType[]))
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  'type-and': {
    evaluate: (params, debugInfo): DataType => {
      params.forEach(param => assertDataType(param, debugInfo))
      return DataType.and(...(params as DataType[]))
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  'type-exclude': {
    evaluate: (params, debugInfo): DataType => {
      params.forEach(param => assertDataType(param, debugInfo))
      const first = asDataType(params[0], debugInfo)
      return DataType.exclude(first, ...(params.slice(1) as DataType[]))
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  'type-is?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertDataType(first, debugInfo)
      assertDataType(second, debugInfo)
      return DataType.is(first, second)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'type-equals?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertDataType(first, debugInfo)
      assertDataType(second, debugInfo)
      return DataType.equals(first, second)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'type-intersects?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertDataType(first, debugInfo)
      assertDataType(second, debugInfo)
      return DataType.intersects(first, second)
    },
    validate: node => assertNumberOfParams(2, node),
  },
}
