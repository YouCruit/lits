import { DataType } from '../../../analyze/dataTypes/DataType'
import { NormalExpressionNode } from '../../../parser/interface'
import { DebugInfo } from '../../../tokenizer/interface'
import { assertNumberOfParams, asValue, dataType, number } from '../../../utils/assertion'
import { BuiltinNormalExpressions } from '../../interface'

export const mathNormalExpression: BuiltinNormalExpressions = {
  inc: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return first + 1
      } else {
        const firstParam = DataType.and(DataType.of(first), DataType.number)
        const isInteger = firstParam.is(DataType.integer)
        const isNonInteger = firstParam.is(DataType.nonInteger)
        if (firstParam.intersects(DataType.negativeNumber)) {
          const additionalType = isInteger
            ? DataType.positiveInteger
            : isNonInteger
            ? DataType.positiveNonInteger
            : DataType.positiveNumber
          return DataType.or(firstParam, isNonInteger ? DataType.never : DataType.zero, additionalType)
        }
        if (firstParam.is(DataType.nonNegativeNumber)) {
          return isInteger
            ? DataType.positiveInteger
            : isNonInteger
            ? DataType.positiveNonInteger
            : DataType.positiveNumber
        }
        return firstParam
      }
    },
    validate: node => assertNumberOfParams(1, node),
  },

  dec: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return first - 1
      } else {
        const firstParam = DataType.and(DataType.of(first), DataType.number)
        const isInteger = firstParam.is(DataType.integer)
        const isNonInteger = firstParam.is(DataType.nonInteger)
        if (firstParam.intersects(DataType.positiveNumber)) {
          const additionalType = isInteger
            ? DataType.negativeInteger
            : isNonInteger
            ? DataType.negativeNonInteger
            : DataType.negativeNumber
          return DataType.or(firstParam, isNonInteger ? DataType.never : DataType.zero, additionalType)
        }
        if (firstParam.is(DataType.nonPositiveNumber)) {
          return isInteger
            ? DataType.negativeInteger
            : isNonInteger
            ? DataType.negativeNonInteger
            : DataType.negativeNumber
        }
        return firstParam
      }
    },
    validate: node => assertNumberOfParams(1, node),
  },

  '+': {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(param => !(param instanceof DataType))) {
        return params.reduce((result: number, param) => {
          number.assert(param, debugInfo)
          return result + param
        }, 0)
      } else {
        const paramTypes = params.map(param => DataType.of(param))
        return getTypeOfSum(paramTypes, debugInfo)
      }
    },
    validate: () => undefined,
  },

  '*': {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(param => !(param instanceof DataType))) {
        return params.reduce((result: number, param) => {
          number.assert(param, debugInfo)
          return result * param
        }, 1)
      } else {
        const paramTypes = params.map(param => DataType.of(param))
        if (paramTypes.length === 1) {
          const firstParamType = asValue(paramTypes[0])
          firstParamType.assertIs(DataType.number, debugInfo)
          return firstParamType
        }

        return getTypeOfProduct(paramTypes, debugInfo)
      }
    },
    validate: () => undefined,
  },

  '/': {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(param => !(param instanceof DataType))) {
        if (params.length === 0) {
          return 1
        }
        const [first, ...rest] = params
        number.assert(first, debugInfo)
        if (rest.length === 0) {
          number.assert(first, debugInfo)
          return 1 / first
        }
        return rest.reduce((result: number, param) => {
          number.assert(param, debugInfo)
          return result / param
        }, first)
      } else {
        const paramTypes = params.map(param => DataType.of(param))
        const firstParamType = asValue(paramTypes[0])
        if (paramTypes.length === 1) {
          firstParamType.assertIs(DataType.nonZeroNumber, debugInfo)
          const withoutZero = firstParamType.exclude(DataType.zero)
          if (withoutZero.is(DataType.positiveInteger)) {
            return DataType.positiveNonInteger
          } else if (withoutZero.is(DataType.negativeInteger)) {
            return DataType.negativeNonInteger
          } else if (withoutZero.is(DataType.integer)) {
            return DataType.positiveNonInteger.or(DataType.negativeNonInteger)
          } else if (withoutZero.is(DataType.negativeNonInteger)) {
            return DataType.negativeNumber
          } else if (withoutZero.is(DataType.positiveNonInteger)) {
            return DataType.positiveNumber
          } else if (withoutZero.is(DataType.positiveNumber)) {
            return DataType.positiveNumber
          } else if (withoutZero.is(DataType.negativeNumber)) {
            return DataType.negativeNumber
          } else {
            return DataType.nonZeroNumber
          }
        }
        const restTypes = paramTypes.slice(1)
        restTypes.forEach(t => t.assertIs(DataType.nonZeroNumber, debugInfo))
        if (firstParamType.is(DataType.zero)) {
          return DataType.zero
        }
        return getTypeOfProduct([firstParamType, ...restTypes], debugInfo)
      }
    },
    validate: () => undefined,
  },

  '-': {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(param => !(param instanceof DataType))) {
        if (params.length === 0) {
          return 0
        }
        const [first, ...rest] = params
        number.assert(first, debugInfo)
        if (rest.length === 0) {
          return -first
        }
        return rest.reduce((result: number, param) => {
          number.assert(param, debugInfo)
          return result - param
        }, first)
      } else {
        const paramTypes = params.map(param => DataType.of(param))
        const firstParamType = asValue(paramTypes[0])
        if (paramTypes.length === 1) {
          return firstParamType.negateNumber()
        }
        const restTypes = paramTypes.slice(1).map(t => t.negateNumber())
        return getTypeOfSum([firstParamType, ...restTypes], debugInfo)
      }
    },
    validate: () => undefined,
  },

  quot: {
    evaluate: ([dividend, divisor], debugInfo): number => {
      number.assert(dividend, debugInfo)
      number.assert(divisor, debugInfo)
      const quotient = Math.trunc(dividend / divisor)
      return quotient
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  mod: {
    evaluate: ([dividend, divisor], debugInfo): number => {
      number.assert(dividend, debugInfo)
      number.assert(divisor, debugInfo)
      const quotient = Math.floor(dividend / divisor)
      return dividend - divisor * quotient
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  rem: {
    evaluate: ([dividend, divisor], debugInfo): number => {
      number.assert(dividend, debugInfo)
      number.assert(divisor, debugInfo)
      const quotient = Math.trunc(dividend / divisor)
      return dividend - divisor * quotient
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  sqrt: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return Math.sqrt(first)
      } else {
        const type = DataType.of(first)
        type.assertIs(DataType.nonNegativeNumber, debugInfo)
        if (type.is(DataType.zero)) {
          return DataType.zero
        }

        const hasZero = type.intersects(DataType.zero)
        const withoutZero = type.exclude(DataType.zero)

        const returnType = withoutZero.is(DataType.positiveNonInteger)
          ? DataType.positiveNonInteger
          : DataType.positiveNumber

        return hasZero ? returnType.or(DataType.zero) : returnType
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  cbrt: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return Math.cbrt(first)
      } else {
        const type = DataType.of(first)
        if (type.is(DataType.zero)) {
          return DataType.zero
        }

        const hasZero = type.intersects(DataType.zero)
        const withoutZero = type.exclude(DataType.zero)

        const returnType = withoutZero.is(DataType.positiveNonInteger)
          ? DataType.positiveNonInteger
          : withoutZero.is(DataType.positiveNumber)
          ? DataType.positiveNumber
          : withoutZero.is(DataType.negativeNonInteger)
          ? DataType.negativeNonInteger
          : withoutZero.is(DataType.negativeNumber)
          ? DataType.negativeNumber
          : withoutZero.is(DataType.nonInteger)
          ? DataType.nonInteger
          : DataType.nonZeroNumber

        return hasZero ? returnType.or(DataType.zero) : returnType
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  pow: {
    evaluate: ([first, second], debugInfo): number => {
      number.assert(first, debugInfo)
      number.assert(second, debugInfo)
      return Math.pow(first, second)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  round: {
    evaluate: (params, debugInfo): number => {
      const [value, decimals] = params
      number.assert(value, debugInfo)
      if (params.length === 1 || decimals === 0) {
        return Math.round(value)
      }
      number.assert(decimals, debugInfo, { integer: true, nonNegative: true })
      const factor = Math.pow(10, decimals)
      return Math.round(value * factor) / factor
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams({ min: 1, max: 2 }, node),
  },

  trunc: {
    evaluate: ([first], debugInfo): number => {
      number.assert(first, debugInfo)
      return Math.trunc(first)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  floor: {
    evaluate: ([first], debugInfo): number => {
      number.assert(first, debugInfo)
      return Math.floor(first)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  ceil: {
    evaluate: ([first], debugInfo): number => {
      number.assert(first, debugInfo)
      return Math.ceil(first)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  'rand!': {
    evaluate: (parameters, debugInfo): number => {
      const num = number.as(parameters.length === 1 ? parameters[0] : 1, debugInfo)
      return Math.random() * num
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams({ min: 0, max: 1 }, node),
  },

  'rand-int!': {
    evaluate: ([first], debugInfo): number => {
      number.assert(first, debugInfo)
      return Math.floor(Math.random() * Math.abs(first)) * Math.sign(first)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  min: {
    evaluate: ([first, ...rest], debugInfo): number => {
      number.assert(first, debugInfo)
      if (rest.length === 0) {
        return first
      }

      return rest.reduce((min: number, value) => {
        number.assert(value, debugInfo)
        return Math.min(min, value)
      }, first)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams({ min: 1 }, node),
  },

  max: {
    evaluate: ([first, ...rest], debugInfo): number => {
      number.assert(first, debugInfo)
      if (rest.length === 0) {
        return first
      }

      return rest.reduce((min: number, value) => {
        number.assert(value, debugInfo)
        return Math.max(min, value)
      }, first)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams({ min: 1 }, node),
  },

  abs: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.abs(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  sign: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.sign(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  'max-safe-integer': {
    evaluate: (): number => {
      return Number.MAX_SAFE_INTEGER
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'min-safe-integer': {
    evaluate: (): number => {
      return Number.MIN_SAFE_INTEGER
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'max-value': {
    evaluate: (): number => {
      return Number.MAX_VALUE
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'min-value': {
    evaluate: (): number => {
      return Number.MIN_VALUE
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  epsilon: {
    evaluate: (): number => {
      return Number.EPSILON
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'positive-infinity': {
    evaluate: (): number => {
      return Number.POSITIVE_INFINITY
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'negative-infinity': {
    evaluate: (): number => {
      return Number.NEGATIVE_INFINITY
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  nan: {
    evaluate: (): number => {
      return Number.NaN
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  e: {
    evaluate: (): number => {
      return Math.E
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  pi: {
    evaluate: (): number => {
      return Math.PI
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  exp: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.exp(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  log: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.log(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  log2: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.log2(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  log10: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.log10(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  sin: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.sin(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  asin: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.asin(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  sinh: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.sinh(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  asinh: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.asinh(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  cos: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.cos(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  acos: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.acos(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  cosh: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.cosh(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  acosh: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.acosh(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  tan: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.tan(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  atan: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.atan(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  tanh: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.tanh(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  atanh: {
    evaluate: ([value], debugInfo): number => {
      number.assert(value, debugInfo)
      return Math.atanh(value)
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },
}

function getTypeOfSum(paramTypes: DataType[], debugInfo: DebugInfo | undefined) {
  return paramTypes.reduce((a: DataType, b) => {
    b.assertIs(DataType.number, debugInfo)
    const param = b.and(DataType.number)

    if (a.is(DataType.zero)) {
      return param
    }

    const aIntegerType = a.is(DataType.integer) ? `integer` : a.is(DataType.nonInteger) ? `nonInteger` : `number`
    const bIntegerType = b.is(DataType.integer) ? `integer` : b.is(DataType.nonInteger) ? `nonInteger` : `number`
    const baseType =
      aIntegerType === `number` || bIntegerType === `number`
        ? DataType.number
        : aIntegerType === `integer` && bIntegerType === `integer`
        ? DataType.integer
        : aIntegerType === `nonInteger` && bIntegerType === `nonInteger`
        ? DataType.number
        : DataType.nonInteger

    if (a.is(DataType.negativeNumber)) {
      if (param.is(DataType.nonPositiveNumber)) {
        return DataType.and(baseType, DataType.negativeNumber)
      } else {
        return baseType
      }
    } else if (a.is(DataType.nonPositiveNumber)) {
      if (param.is(DataType.negativeNumber)) {
        return DataType.and(baseType, DataType.negativeNumber)
      } else if (param.is(DataType.nonPositiveNumber)) {
        return DataType.and(baseType, DataType.nonPositiveNumber)
      } else {
        return baseType
      }
    } else if (a.is(DataType.positiveNumber)) {
      if (param.is(DataType.nonNegativeNumber)) {
        return DataType.and(baseType, DataType.positiveNumber)
      } else {
        return baseType
      }
    } else if (a.is(DataType.nonNegativeNumber)) {
      if (param.is(DataType.positiveNumber)) {
        return DataType.and(baseType, DataType.positiveNumber)
      } else if (param.is(DataType.nonNegativeNumber)) {
        return DataType.and(baseType, DataType.nonNegativeNumber)
      } else {
        return baseType
      }
    } else {
      return DataType.and(baseType, DataType.number)
    }
  }, DataType.zero)
}

function getTypeOfProduct(paramTypes: DataType[], debugInfo: DebugInfo | undefined) {
  const first = asValue(paramTypes[0])
  return paramTypes.slice(1).reduce((a: DataType, b) => {
    a.assertIs(DataType.number, debugInfo)
    b.assertIs(DataType.number, debugInfo)

    if (a.is(DataType.zero) || b.is(DataType.zero)) {
      return DataType.zero
    }

    const aIntegerType = a.is(DataType.integer) ? `integer` : a.is(DataType.nonInteger) ? `nonInteger` : `number`
    const bIntegerType = b.is(DataType.integer) ? `integer` : b.is(DataType.nonInteger) ? `nonInteger` : `number`
    const baseType =
      aIntegerType === `number` || bIntegerType === `number`
        ? DataType.number
        : aIntegerType === `integer` && bIntegerType === `integer`
        ? DataType.integer
        : aIntegerType === `nonInteger` && bIntegerType === `nonInteger`
        ? DataType.nonInteger
        : DataType.number

    const aSign = a.is(DataType.negativeNumber)
      ? `<0`
      : a.is(DataType.nonPositiveNumber)
      ? `<=0`
      : a.is(DataType.positiveNumber)
      ? `>0`
      : a.is(DataType.nonNegativeNumber)
      ? `>=0`
      : `?`

    const bSign = b.is(DataType.negativeNumber)
      ? `<0`
      : b.is(DataType.nonPositiveNumber)
      ? `<=0`
      : b.is(DataType.positiveNumber)
      ? `>0`
      : b.is(DataType.nonNegativeNumber)
      ? `>=0`
      : `?`

    switch (aSign) {
      case `<0`:
        switch (bSign) {
          case `<0`:
            return DataType.and(baseType, DataType.positiveNumber)
          case `<=0`:
            return DataType.and(baseType, DataType.nonNegativeNumber)
          case `>0`:
            return DataType.and(baseType, DataType.negativeNumber)
          case `>=0`:
            return DataType.and(baseType, DataType.nonPositiveNumber)
        }
        break
      case `<=0`:
        switch (bSign) {
          case `<0`:
            return DataType.and(baseType, DataType.nonNegativeNumber)
          case `<=0`:
            return DataType.and(baseType, DataType.nonNegativeNumber)
          case `>0`:
            return DataType.and(baseType, DataType.nonPositiveNumber)
          case `>=0`:
            return DataType.and(baseType, DataType.nonPositiveNumber)
        }
        break
      case `>0`:
        switch (bSign) {
          case `<0`:
            return DataType.and(baseType, DataType.negativeNumber)
          case `<=0`:
            return DataType.and(baseType, DataType.nonPositiveNumber)
          case `>0`:
            return DataType.and(baseType, DataType.positiveNumber)
          case `>=0`:
            return DataType.and(baseType, DataType.nonNegativeNumber)
        }
        break
      case `>=0`:
        switch (bSign) {
          case `<0`:
            return DataType.and(baseType, DataType.nonPositiveNumber)
          case `<=0`:
            return DataType.and(baseType, DataType.nonPositiveNumber)
          case `>0`:
            return DataType.and(baseType, DataType.nonNegativeNumber)
          case `>=0`:
            return DataType.and(baseType, DataType.nonNegativeNumber)
        }
        break
    }
    return baseType
  }, first)
}
