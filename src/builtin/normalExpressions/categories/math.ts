import { DataType } from '../../../analyze/dataTypes/DataType'
import { Arr } from '../../../interface'
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
        const paramType = DataType.of(first)
        paramType.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)

        const types: DataType[] = []

        if (paramType.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }
        if (paramType.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (paramType.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }

        if (paramType.intersects(DataType.zero)) {
          types.push(DataType.positiveInteger)
        }
        if (paramType.intersects(DataType.negativeInteger)) {
          types.push(DataType.nonPositiveInteger)
        }
        if (paramType.intersects(DataType.negativeNonInteger)) {
          types.push(DataType.nonInteger)
        }
        if (paramType.intersects(DataType.positiveInteger)) {
          types.push(DataType.positiveInteger)
        }
        if (paramType.intersects(DataType.positiveNonInteger)) {
          types.push(DataType.positiveNonInteger)
        }

        return DataType.or(...types)
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
        const paramType = DataType.of(first)
        paramType.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)

        const types: DataType[] = []

        if (paramType.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }
        if (paramType.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (paramType.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }

        if (paramType.intersects(DataType.zero)) {
          types.push(DataType.negativeInteger)
        }
        if (paramType.intersects(DataType.positiveInteger)) {
          types.push(DataType.nonNegativeInteger)
        }
        if (paramType.intersects(DataType.positiveNonInteger)) {
          types.push(DataType.nonInteger)
        }
        if (paramType.intersects(DataType.negativeInteger)) {
          types.push(DataType.negativeInteger)
        }
        if (paramType.intersects(DataType.negativeNonInteger)) {
          types.push(DataType.negativeNonInteger)
        }

        return DataType.or(...types)
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

  '*': {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(param => !(param instanceof DataType))) {
        return params.reduce((result: number, param) => {
          number.assert(param, debugInfo)
          return result * param
        }, 1)
      } else {
        return getTypeOfProduct(params, debugInfo)
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
        return getTypeOfDivision(params, debugInfo)
      }
    },
    validate: () => undefined,
  },

  quot: {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(dataType.isNot)) {
        const [dividend, divisor] = params
        number.assert(dividend, debugInfo)
        number.assert(divisor, debugInfo)
        const quotient = Math.trunc(dividend / divisor)
        return quotient
      } else {
        const a = DataType.of(params[0])
        const b = DataType.of(params[1])
        a.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)
        b.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)

        const types: DataType[] = []
        if (a.or(b).intersects(DataType.nan)) {
          types.push(DataType.nan)
        }
        if (a.intersects(DataType.positiveInfinity)) {
          if (a.intersects(DataType.nonNegativeNumber)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.intersects(DataType.negativeNumber)) {
            types.push(DataType.negativeInfinity)
          }
          if (a.intersects(DataType.illegalNumber)) {
            types.push(DataType.nan)
          }
        }
        if (a.intersects(DataType.negativeInfinity)) {
          if (a.intersects(DataType.nonNegativeNumber)) {
            types.push(DataType.negativeInfinity)
          }
          if (a.intersects(DataType.negativeNumber)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.intersects(DataType.illegalNumber)) {
            types.push(DataType.nan)
          }
        }

        if (b.intersects(DataType.positiveInfinity.or(DataType.negativeInfinity))) {
          if (a.intersects(DataType.number)) {
            types.push(DataType.zero)
          }
        }

        if (a.intersects(DataType.zero) && b.intersects(DataType.nonZeroNumber)) {
          types.push(DataType.zero)
        }
        if (b.intersects(DataType.zero)) {
          if (a.intersects(DataType.zero)) {
            types.push(DataType.nan)
          }
          if (a.intersects(DataType.positiveNumber)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.intersects(DataType.negativeNumber)) {
            types.push(DataType.negativeInfinity)
          }
        }

        if (a.intersects(DataType.positiveNumber)) {
          if (b.intersects(DataType.positiveNumber)) {
            types.push(DataType.nonNegativeInteger)
          }
          if (b.intersects(DataType.negativeNumber)) {
            types.push(DataType.nonPositiveInteger)
          }
        }
        if (a.intersects(DataType.negativeNumber)) {
          if (b.intersects(DataType.negativeNumber)) {
            types.push(DataType.nonNegativeInteger)
          }
          if (b.intersects(DataType.positiveNumber)) {
            types.push(DataType.nonPositiveInteger)
          }
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  mod: {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(dataType.isNot)) {
        const [dividend, divisor] = params
        number.assert(dividend, debugInfo)
        number.assert(divisor, debugInfo)
        const quotient = Math.floor(dividend / divisor)
        return dividend - divisor * quotient
      } else {
        const a = DataType.of(params[0])
        const b = DataType.of(params[1])
        a.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)
        b.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)

        const types: DataType[] = []
        if (a.or(b).intersects(DataType.illegalNumber)) {
          types.push(DataType.nan)
        }
        if (b.intersects(DataType.zero)) {
          types.push(DataType.nan)
        }
        if (b.intersects(DataType.negativeNumber) && a.intersects(DataType.number)) {
          types.push(DataType.nonPositiveNumber)
        }
        if (b.intersects(DataType.positiveNumber) && a.intersects(DataType.number)) {
          types.push(DataType.nonNegativeNumber)
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  rem: {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(dataType.isNot)) {
        const [dividend, divisor] = params
        number.assert(dividend, debugInfo)
        number.assert(divisor, debugInfo)
        const quotient = Math.trunc(dividend / divisor)
        return dividend - divisor * quotient
      } else {
        const a = DataType.of(params[0])
        const b = DataType.of(params[1])
        a.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)
        b.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)

        const types: DataType[] = []
        if (a.or(b).intersects(DataType.illegalNumber)) {
          types.push(DataType.nan)
        }
        if (b.intersects(DataType.zero)) {
          types.push(DataType.nan)
        }
        if (a.intersects(DataType.negativeNumber) && b.intersects(DataType.number)) {
          types.push(DataType.nonPositiveNumber)
        }
        if (a.intersects(DataType.positiveNumber) && b.intersects(DataType.number)) {
          types.push(DataType.nonNegativeNumber)
        }

        return DataType.or(...types)
      }
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
        type.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)
        if (type.is(DataType.zero)) {
          return DataType.zero
        }

        const hasZero = type.intersects(DataType.zero)
        const hasNegativeNumber = type.intersects(DataType.negativeNumber)
        const illegalTypes = type.and(DataType.illegalNumber)
        const stripped = type.exclude(DataType.zero, DataType.negativeNumber, DataType.illegalNumber)

        const returnType = stripped.is(DataType.positiveNonInteger)
          ? DataType.positiveNonInteger
          : stripped.is(DataType.positiveNumber)
          ? DataType.positiveNumber
          : DataType.never

        return DataType.or(
          returnType,
          hasZero ? DataType.zero : DataType.never,
          hasNegativeNumber ? DataType.nan : DataType.never,
          illegalTypes.intersects(DataType.nan) ? DataType.nan : DataType.never,
          illegalTypes.intersects(DataType.positiveInfinity) ? DataType.positiveInfinity : DataType.never,
          illegalTypes.intersects(DataType.negativeInfinity) ? DataType.nan : DataType.never,
        )
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
  paramTypes.every(type => type.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo))

  return paramTypes.reduce((a: DataType, b) => getTypeOfBinarySum(a, b), DataType.zero)
}

function getTypeOfBinarySum(a: DataType, b: DataType): DataType {
  const types: DataType[] = []

  if (a.or(b).intersects(DataType.nan)) {
    types.push(DataType.nan)
  }

  if (a.intersects(DataType.positiveInfinity)) {
    if (b.intersects(DataType.positiveInfinity)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.negativeInfinity)) {
      types.push(DataType.nan)
    }
    if (b.intersects(DataType.number)) {
      types.push(DataType.positiveInfinity)
    }
  }
  if (a.intersects(DataType.negativeInfinity)) {
    if (b.intersects(DataType.positiveInfinity)) {
      types.push(DataType.nan)
    }
    if (b.intersects(DataType.negativeInfinity)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.number)) {
      types.push(DataType.negativeInfinity)
    }
  }
  if (b.intersects(DataType.positiveInfinity)) {
    if (a.intersects(DataType.number)) {
      types.push(DataType.positiveInfinity)
    }
  }
  if (b.intersects(DataType.negativeInfinity)) {
    if (a.intersects(DataType.number)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (a.and(b).intersects(DataType.zero)) {
    types.push(DataType.zero)
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

  if (a.intersects(DataType.positiveNumber)) {
    if (b.intersects(DataType.positiveNumber)) {
      types.push(DataType.positiveNumber.and(baseType))
    }
    if (b.intersects(DataType.negativeNumber)) {
      types.push(DataType.number.and(baseType))
    }
  }
  if (a.intersects(DataType.negativeNumber)) {
    if (b.intersects(DataType.negativeNumber)) {
      types.push(DataType.negativeNumber.and(baseType))
    }
    if (b.intersects(DataType.positiveNumber)) {
      types.push(DataType.number.and(baseType))
    }
  }
  if (a.intersects(DataType.zero)) {
    types.push(b)
  }
  if (b.intersects(DataType.zero)) {
    types.push(a)
  }

  return DataType.or(...types)
}

function getTypeOfProduct(params: Arr, debugInfo: DebugInfo | undefined): DataType {
  const paramTypes = params.map(param => {
    const type = DataType.of(param)
    type.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)
    return type
  })

  if (paramTypes.length === 1) {
    return asValue(paramTypes[0])
  }

  const first = asValue(paramTypes[0])
  return paramTypes.slice(1).reduce((a: DataType, b) => getTypeOfBinaryProduct(a, b), first)
}

function getTypeOfBinaryProduct(a: DataType, b: DataType): DataType {
  const types: DataType[] = []
  if (a.or(b).intersects(DataType.nan)) {
    types.push(DataType.nan)
  }

  if (a.intersects(DataType.positiveInfinity)) {
    if (b.intersects(DataType.positiveInfinity) || b.intersects(DataType.positiveNumber)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.negativeInfinity) || b.intersects(DataType.negativeNumber)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.zero)) {
      types.push(DataType.nan)
    }
  }

  if (a.intersects(DataType.negativeInfinity)) {
    if (b.intersects(DataType.negativeInfinity) || b.intersects(DataType.negativeNumber)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.positiveInfinity) || b.intersects(DataType.positiveNumber)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.zero)) {
      types.push(DataType.nan)
    }
  }

  if (b.intersects(DataType.positiveInfinity)) {
    if (a.intersects(DataType.zero)) {
      types.push(DataType.nan)
    }
    if (a.intersects(DataType.positiveNumber)) {
      types.push(DataType.positiveInfinity)
    }
    if (a.intersects(DataType.negativeNumber)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (b.intersects(DataType.negativeInfinity)) {
    if (a.intersects(DataType.zero)) {
      types.push(DataType.nan)
    }
    if (a.intersects(DataType.positiveNumber)) {
      types.push(DataType.negativeInfinity)
    }
    if (a.intersects(DataType.negativeNumber)) {
      types.push(DataType.positiveInfinity)
    }
  }

  if (a.or(b).intersects(DataType.zero)) {
    types.push(DataType.zero)
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

  const aNeg = a.intersects(DataType.negativeNumber)
  const aPos = a.intersects(DataType.positiveNumber)
  const bNeg = b.intersects(DataType.negativeNumber)
  const bPos = b.intersects(DataType.positiveNumber)

  if ((aNeg && bNeg) || (aPos && bPos)) {
    types.push(DataType.positiveNumber.and(baseType))
  }

  if ((aNeg && bPos) || (aPos && bNeg)) {
    types.push(DataType.negativeNumber.and(baseType))
  }

  return DataType.or(...types)
}

function getTypeOfDivision(params: Arr, debugInfo: DebugInfo | undefined): DataType {
  const paramTypes = params.map(param => {
    const type = DataType.of(param)
    type.assertIs(DataType.number.or(DataType.illegalNumber), debugInfo)
    return type
  })

  if (paramTypes.length === 1) {
    paramTypes.unshift(DataType.positiveInteger)
  }

  const first = asValue(paramTypes[0])
  return paramTypes.slice(1).reduce((a: DataType, b) => getTypeOfBinaryDivision(a, b), first)
}

function getTypeOfBinaryDivision(a: DataType, b: DataType): DataType {
  const types: DataType[] = []
  if (a.or(b).intersects(DataType.nan)) {
    types.push(DataType.nan)
  }

  if (a.intersects(DataType.positiveInfinity)) {
    if (b.intersects(DataType.illegalNumber)) {
      types.push(DataType.nan)
    }
    if (b.intersects(DataType.zero)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.positiveNumber)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.negativeNumber)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (a.intersects(DataType.negativeInfinity)) {
    if (b.intersects(DataType.illegalNumber)) {
      types.push(DataType.nan)
    }
    if (b.intersects(DataType.zero)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.positiveNumber)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.negativeNumber)) {
      types.push(DataType.positiveInfinity)
    }
  }

  if (b.intersects(DataType.positiveInfinity.or(DataType.negativeInfinity))) {
    if (a.intersects(DataType.number)) {
      types.push(DataType.zero)
    }
  }

  if (a.intersects(DataType.zero)) {
    if (b.intersects(DataType.zero)) {
      types.push(DataType.nan)
    }
    if (b.intersects(DataType.nonZeroNumber)) {
      types.push(DataType.zero)
    }
  }

  if (b.intersects(DataType.zero)) {
    if (a.intersects(DataType.positiveNumber)) {
      types.push(DataType.positiveInfinity)
    }
    if (a.intersects(DataType.negativeNumber)) {
      types.push(DataType.negativeInfinity)
    }
  }

  const baseType = a.is(DataType.nonInteger) && b.is(DataType.integer) ? DataType.nonInteger : DataType.number

  const aNeg = a.intersects(DataType.negativeNumber)
  const aPos = a.intersects(DataType.positiveNumber)
  const bNeg = b.intersects(DataType.negativeNumber)
  const bPos = b.intersects(DataType.positiveNumber)

  if ((aNeg && bNeg) || (aPos && bPos)) {
    types.push(DataType.positiveNumber.and(baseType))
  }

  if ((aNeg && bPos) || (aPos && bNeg)) {
    types.push(DataType.negativeNumber.and(baseType))
  }

  return DataType.or(...types)
}
