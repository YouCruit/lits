import { asDataType, assertDataType, DataType } from '../../../analyze/dataTypes/DataType'
import { any, assertNumberOfParams } from '../../../utils/assertion'
import { BuiltinNormalExpressions } from '../../interface'

export const typeNormalExpression: BuiltinNormalExpressions = {
  'type-of': {
    evaluate: ([value], debugInfo): DataType => {
      any.assert(value, debugInfo)
      return DataType.of(value)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(1, arity, `type-of`, debugInfo),
  },
  'type-or': {
    evaluate: (params, debugInfo): DataType => {
      params.forEach(param => assertDataType(param, debugInfo))
      return DataType.or(...(params as DataType[]))
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams({ min: 1 }, arity, `type-or`, debugInfo),
  },
  'type-and': {
    evaluate: (params, debugInfo): DataType => {
      params.forEach(param => assertDataType(param, debugInfo))
      return DataType.and(...(params as DataType[]))
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams({ min: 1 }, arity, `type-and`, debugInfo),
  },
  'type-exclude': {
    evaluate: (params, debugInfo): DataType => {
      params.forEach(param => assertDataType(param, debugInfo))
      const first = asDataType(params[0], debugInfo)
      return DataType.exclude(first, ...(params.slice(1) as DataType[]))
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams({ min: 1 }, arity, `type-exclude`, debugInfo),
  },
  'type-is?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertDataType(first, debugInfo)
      assertDataType(second, debugInfo)
      return DataType.is(first, second)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(2, arity, `type-is?`, debugInfo),
  },
  'type-equals?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertDataType(first, debugInfo)
      assertDataType(second, debugInfo)
      return DataType.equals(first, second)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(2, arity, `type-equals?`, debugInfo),
  },
  'type-intersects?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertDataType(first, debugInfo)
      assertDataType(second, debugInfo)
      return DataType.intersects(first, second)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(2, arity, `type-intersects?`, debugInfo),
  },
}
