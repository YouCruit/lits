import { asType, assertType, Type, isType } from '../../../types/Type'
import { Any } from '../../../interface'
import { any, assertNumberOfParams } from '../../../utils/assertion'
import { BuiltinNormalExpressions } from '../../interface'

export const typeNormalExpression: BuiltinNormalExpressions = {
  'type-of': {
    evaluate: ([value], debugInfo): Type => {
      any.assert(value, debugInfo)
      return Type.of(value)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(1, arity, `type-of`, debugInfo),
  },
  'type-to-value': {
    evaluate: ([value], debugInfo): Any => {
      any.assert(value, debugInfo)
      if (isType(value)) {
        return Type.toValue(value)
      } else {
        return value
      }
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(1, arity, `type-of`, debugInfo),
  },
  'type-split': {
    evaluate: ([value], debugInfo): Any => {
      assertType(value, debugInfo)
      return Type.split(value)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(1, arity, `type-of`, debugInfo),
  },
  'type-or': {
    evaluate: (params, debugInfo): Type => {
      params.forEach(param => assertType(param, debugInfo))
      return Type.or(...(params as Type[]))
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams({ min: 1 }, arity, `type-or`, debugInfo),
  },
  'type-and': {
    evaluate: (params, debugInfo): Type => {
      params.forEach(param => assertType(param, debugInfo))
      return Type.and(...(params as Type[]))
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams({ min: 1 }, arity, `type-and`, debugInfo),
  },
  'type-exclude': {
    evaluate: (params, debugInfo): Type => {
      params.forEach(param => assertType(param, debugInfo))
      const first = asType(params[0], debugInfo)
      return Type.exclude(first, ...(params.slice(1) as Type[]))
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams({ min: 1 }, arity, `type-exclude`, debugInfo),
  },
  'type-is?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertType(first, debugInfo)
      assertType(second, debugInfo)
      return Type.is(first, second)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(2, arity, `type-is?`, debugInfo),
  },
  'type-equals?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertType(first, debugInfo)
      assertType(second, debugInfo)
      return Type.equals(first, second)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(2, arity, `type-equals?`, debugInfo),
  },
  'type-intersects?': {
    evaluate: ([first, second], debugInfo): boolean => {
      assertType(first, debugInfo)
      assertType(second, debugInfo)
      return Type.intersects(first, second)
    },
    validateArity: (arity, debugInfo) => assertNumberOfParams(2, arity, `type-intersects?`, debugInfo),
  },
}
