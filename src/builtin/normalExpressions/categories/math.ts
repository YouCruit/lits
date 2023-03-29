import { DataType } from '../../../analyze/dataTypes/DataType'
import { NormalExpressionNode } from '../../../parser/interface'
import { DebugInfo } from '../../../tokenizer/interface'
import { MAX_NUMBER, MIN_NUMBER } from '../../../utils'
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
        paramType.assertIs(DataType.number, debugInfo)

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
        if (paramType.intersects(DataType.negativeFloat)) {
          if (paramType.isInteger()) {
            types.push(DataType.nonPositiveInteger)
          } else {
            types.push(DataType.float)
          }
        }
        if (paramType.intersects(DataType.positiveFloat)) {
          types.push(DataType.positiveInfinity)
          if (paramType.isInteger()) {
            types.push(DataType.positiveInteger)
          } else {
            types.push(DataType.positiveFloat)
          }
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
        paramType.assertIs(DataType.number, debugInfo)

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
        if (paramType.intersects(DataType.positiveFloat)) {
          if (paramType.isInteger()) {
            types.push(DataType.nonNegativeInteger)
          } else {
            types.push(DataType.float)
          }
        }
        if (paramType.intersects(DataType.negativeFloat)) {
          types.push(DataType.negativeInfinity)
          if (paramType.isInteger()) {
            types.push(DataType.negativeInteger)
          } else {
            types.push(DataType.negativeFloat)
          }
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
        paramTypes.forEach(t => t.assertIs(DataType.number, debugInfo))
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
        paramTypes.forEach(t => t.assertIs(DataType.number, debugInfo))

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
          if (result === 0 || param === 0) {
            return 0
          }
          return result * param
        }, 1)
      } else {
        const paramTypes = params.map(param => DataType.of(param))
        paramTypes.forEach(t => t.assertIs(DataType.number, debugInfo))

        return getTypeOfProduct(paramTypes)
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
          if (result === 0) {
            return 0
          }
          if (param === Number.POSITIVE_INFINITY || param === Number.NEGATIVE_INFINITY) {
            return 0
          }
          return result / param
        }, first)
      } else {
        const paramTypes = params.map(param => DataType.of(param))
        paramTypes.forEach(t => t.assertIs(DataType.number, debugInfo))

        return getTypeOfDivision(paramTypes)
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
        return Math.trunc(dividend / divisor)
      } else {
        const a = DataType.of(params[0])
        const b = DataType.of(params[1])
        a.assertIs(DataType.number, debugInfo)
        b.assertIs(DataType.number, debugInfo)

        const types: DataType[] = []
        if (a.or(b).intersects(DataType.nan)) {
          types.push(DataType.nan)
        }
        if (a.intersects(DataType.positiveInfinity)) {
          if (a.intersects(DataType.nonNegativeFloat)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.intersects(DataType.negativeFloat)) {
            types.push(DataType.negativeInfinity)
          }
          if (a.intersects(DataType.illegalNumber)) {
            types.push(DataType.nan)
          }
        }
        if (a.intersects(DataType.negativeInfinity)) {
          if (a.intersects(DataType.nonNegativeFloat)) {
            types.push(DataType.negativeInfinity)
          }
          if (a.intersects(DataType.negativeFloat)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.intersects(DataType.illegalNumber)) {
            types.push(DataType.nan)
          }
        }

        if (b.intersects(DataType.positiveInfinity.or(DataType.negativeInfinity))) {
          if (a.intersects(DataType.float)) {
            types.push(DataType.zero)
          }
        }

        if (a.intersects(DataType.zero) && b.intersects(DataType.nonZeroFloat)) {
          types.push(DataType.zero)
        }
        if (b.intersects(DataType.zero)) {
          if (a.intersects(DataType.zero)) {
            types.push(DataType.nan)
          }
          if (a.intersects(DataType.positiveFloat)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.intersects(DataType.negativeFloat)) {
            types.push(DataType.negativeInfinity)
          }
        }

        if (a.intersects(DataType.positiveFloat)) {
          if (b.intersects(DataType.positiveFloat)) {
            types.push(DataType.nonNegativeInteger)
            types.push(DataType.positiveInfinity)
          }
          if (b.intersects(DataType.negativeFloat)) {
            types.push(DataType.nonPositiveInteger)
            types.push(DataType.negativeInfinity)
          }
        }
        if (a.intersects(DataType.negativeFloat)) {
          if (b.intersects(DataType.negativeFloat)) {
            types.push(DataType.nonNegativeInteger)
            types.push(DataType.positiveInfinity)
          }
          if (b.intersects(DataType.positiveFloat)) {
            types.push(DataType.nonPositiveInteger)
            types.push(DataType.negativeInfinity)
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
        a.assertIs(DataType.number, debugInfo)
        b.assertIs(DataType.number, debugInfo)

        const types: DataType[] = []
        if (a.or(b).intersects(DataType.illegalNumber)) {
          types.push(DataType.nan)
        }
        if (b.intersects(DataType.zero)) {
          types.push(DataType.nan)
        }
        if (b.intersects(DataType.negativeFloat) && a.intersects(DataType.float)) {
          types.push(DataType.nonPositiveFloat)
        }
        if (b.intersects(DataType.positiveFloat) && a.intersects(DataType.float)) {
          types.push(DataType.nonNegativeFloat)
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
        a.assertIs(DataType.number, debugInfo)
        b.assertIs(DataType.number, debugInfo)

        const types: DataType[] = []
        if (a.or(b).intersects(DataType.illegalNumber)) {
          types.push(DataType.nan)
        }
        if (b.intersects(DataType.zero)) {
          types.push(DataType.nan)
        }
        if (a.intersects(DataType.negativeFloat) && b.intersects(DataType.float)) {
          types.push(DataType.nonPositiveFloat)
        }
        if (a.intersects(DataType.positiveFloat) && b.intersects(DataType.float)) {
          types.push(DataType.nonNegativeFloat)
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
        type.assertIs(DataType.number, debugInfo)

        const types: DataType[] = []
        if (type.intersects(DataType.nan.or(DataType.negativeInfinity))) {
          types.push(DataType.nan)
        }
        if (type.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }

        if (type.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }
        if (type.intersects(DataType.negativeFloat)) {
          types.push(DataType.nan)
        }
        if (type.intersects(DataType.positiveFloat)) {
          types.push(DataType.positiveFloat)
        }

        return DataType.or(...types)
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
        type.assertIs(DataType.number, debugInfo)

        const types: DataType[] = []

        if (type.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }
        if (type.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (type.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }

        if (type.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }

        if (type.intersects(DataType.positiveFloat)) {
          types.push(DataType.positiveFloat)
        }

        if (type.intersects(DataType.negativeFloat)) {
          types.push(DataType.negativeFloat)
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  pow: {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(dataType.isNot)) {
        const [first, second] = params
        number.assert(first, debugInfo)
        number.assert(second, debugInfo)
        if (first === 1 && !Number.isNaN(second)) {
          return 1
        }
        return Math.pow(first, second)
      } else {
        const a = asValue(DataType.of(params[0]))
        const b = asValue(DataType.of(params[1]))
        a.assertIs(DataType.number, debugInfo)
        b.assertIs(DataType.number, debugInfo)
        const types: DataType[] = []
        if (a.intersects(DataType.nan)) {
          if (b.intersects(DataType.zero)) {
            types.push(DataType.positiveInteger)
          }
          if (!b.exclude(DataType.zero).isNever()) {
            types.push(DataType.nan)
          }
        }

        if (b.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }

        if (a.intersects(DataType.positiveInfinity)) {
          if (b.intersects(DataType.positiveInfinity.or(DataType.positiveFloat))) {
            types.push(DataType.positiveInfinity)
          }
          if (b.intersects(DataType.negativeInfinity.or(DataType.negativeFloat))) {
            types.push(DataType.zero)
          }
          if (b.intersects(DataType.zero)) {
            types.push(DataType.positiveInteger)
          }
        }
        if (a.intersects(DataType.negativeInfinity)) {
          if (b.intersects(DataType.positiveInfinity)) {
            types.push(DataType.positiveInfinity)
          }
          if (b.intersects(DataType.positiveFloat)) {
            types.push(DataType.positiveInfinity)
            types.push(DataType.negativeInfinity)
          }
          if (b.intersects(DataType.negativeInfinity.or(DataType.negativeFloat))) {
            types.push(DataType.zero)
          }
          if (b.intersects(DataType.zero)) {
            types.push(DataType.positiveInteger)
          }
        }

        if (b.intersects(DataType.positiveInfinity)) {
          if (a.intersects(DataType.zero)) {
            types.push(DataType.zero)
          }
          if (a.intersects(DataType.positiveFloat)) {
            types.push(DataType.positiveInfinity)
            types.push(DataType.positiveInteger)
            if (!a.isInteger()) {
              types.push(DataType.zero)
            }
          }
          if (a.intersects(DataType.negativeFloat)) {
            types.push(DataType.positiveInfinity)
            if (!a.isInteger()) {
              types.push(DataType.nan)
            } else {
              types.push(DataType.zero)
            }
          }
        }

        if (a.intersects(DataType.zero)) {
          if (b.intersects(DataType.zero)) {
            types.push(DataType.positiveInteger)
          }
          if (b.intersects(DataType.positiveFloat)) {
            types.push(DataType.zero)
          }
          if (b.intersects(DataType.negativeFloat)) {
            types.push(DataType.positiveInfinity)
          }
        }

        if (b.intersects(DataType.zero)) {
          if (a.intersects(DataType.float)) {
            types.push(DataType.positiveInteger)
          }
        }

        if (a.intersects(DataType.positiveFloat)) {
          if (b.intersects(DataType.positiveFloat)) {
            types.push(DataType.positiveInfinity)
          }
          if (a.isInteger()) {
            if (b.intersects(DataType.positiveFloat)) {
              if (b.isInteger()) {
                types.push(DataType.positiveInteger)
              } else {
                types.push(DataType.positiveFloat)
              }
            }
            if (b.intersects(DataType.negativeFloat)) {
              types.push(DataType.nonNegativeFloat)
            }
          } else {
            if (b.intersects(DataType.positiveFloat)) {
              types.push(DataType.positiveFloat)
            }
            if (b.intersects(DataType.negativeFloat)) {
              types.push(DataType.nonNegativeFloat)
            }
          }
        }

        if (a.intersects(DataType.negativeFloat)) {
          if (b.intersects(DataType.positiveInteger)) {
            types.push(DataType.infinity)
          }
          if (b.intersects(DataType.float) && !b.isInteger()) {
            types.push(DataType.nan)
          }
          if (a.isInteger()) {
            if (b.intersects(DataType.positiveInteger)) {
              types.push(DataType.positiveInteger)
              types.push(DataType.negativeInteger)
            } else if (b.intersects(DataType.negativeInteger)) {
              types.push(DataType.positiveFloat)
              types.push(DataType.negativeFloat)
            }
          } else {
            if (b.intersects(DataType.integer)) {
              types.push(DataType.positiveFloat)
              types.push(DataType.negativeFloat)
            }
          }
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(2, node),
  },

  round: {
    evaluate: (params, debugInfo): number | DataType => {
      if (params.every(dataType.isNot)) {
        const [value, decimals] = params
        number.assert(value, debugInfo)
        if (params.length === 1 || decimals === 0) {
          return Math.round(value)
        }
        number.assert(decimals, debugInfo, { integer: true, nonNegative: true })
        const factor = Math.pow(10, decimals)
        if (factor === Number.POSITIVE_INFINITY) {
          return value
        }
        return Math.round(value * factor) / factor
      } else {
        const a = asValue(DataType.of(params[0]))
        const b = asValue(DataType.of(params[1] ?? 0))
        a.assertIs(DataType.number, debugInfo)
        b.assertIs(DataType.nonNegativeInteger, debugInfo)
        const types: DataType[] = []
        if (a.intersects(DataType.positiveInfinity) && !b.intersects(DataType.illegalNumber)) {
          types.push(DataType.positiveInfinity)
        }
        if (a.intersects(DataType.negativeInfinity) && !b.intersects(DataType.illegalNumber)) {
          types.push(DataType.negativeInfinity)
        }
        if (a.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }

        if (b.intersects(DataType.illegalNumber)) {
          types.push(DataType.nan)
        }

        if (a.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }
        if (a.intersects(DataType.positiveFloat)) {
          if (a.isInteger()) {
            types.push(DataType.positiveInteger)
          } else {
            if (b.intersects(DataType.zero)) {
              types.push(DataType.nonNegativeInteger)
            }
            if (b.intersects(DataType.nonZeroFloat)) {
              types.push(DataType.nonNegativeFloat)
            }
          }
        }
        if (a.intersects(DataType.negativeFloat)) {
          if (a.isInteger()) {
            types.push(DataType.negativeInteger)
          } else {
            if (b.intersects(DataType.zero)) {
              types.push(DataType.nonPositiveInteger)
            }
            if (b.intersects(DataType.nonZeroFloat)) {
              types.push(DataType.nonPositiveFloat)
            }
          }
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams({ min: 1, max: 2 }, node),
  },

  trunc: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return Math.trunc(first)
      } else {
        const a = DataType.of(first)
        a.assertIs(DataType.number, debugInfo)
        const types: DataType[] = []
        if (a.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (a.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }
        if (a.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }

        if (a.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }
        if (a.intersects(DataType.positiveFloat)) {
          if (a.isInteger()) {
            types.push(DataType.positiveInteger)
          } else {
            types.push(DataType.nonNegativeInteger)
          }
        }
        if (a.intersects(DataType.negativeFloat)) {
          if (a.isInteger()) {
            types.push(DataType.negativeInteger)
          } else {
            types.push(DataType.nonPositiveInteger)
          }
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  floor: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return Math.floor(first)
      } else {
        const a = DataType.of(first)
        a.assertIs(DataType.number, debugInfo)
        const types: DataType[] = []
        if (a.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (a.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }
        if (a.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }

        if (a.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }
        if (a.intersects(DataType.positiveFloat)) {
          if (a.isInteger()) {
            types.push(DataType.positiveInteger)
          } else {
            types.push(DataType.nonNegativeInteger)
          }
        }
        if (a.intersects(DataType.negativeFloat)) {
          types.push(DataType.negativeInteger)
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  ceil: {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return Math.ceil(first)
      } else {
        const a = DataType.of(first)
        a.assertIs(DataType.number, debugInfo)
        const types: DataType[] = []
        if (a.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (a.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }
        if (a.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }

        if (a.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }
        if (a.intersects(DataType.positiveFloat)) {
          types.push(DataType.positiveInteger)
        }
        if (a.intersects(DataType.negativeFloat)) {
          if (a.isInteger()) {
            types.push(DataType.negativeInteger)
          } else {
            types.push(DataType.nonPositiveInteger)
          }
        }

        return DataType.or(...types)
      }
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(1, node),
  },

  'rand!': {
    evaluate: (): number => {
      return Math.random()
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'rand-int!': {
    evaluate: ([first], debugInfo): number | DataType => {
      if (dataType.isNot(first)) {
        number.assert(first, debugInfo)
        return Math.floor(Math.random() * Math.abs(first)) * Math.sign(first)
      } else {
        const a = DataType.of(first)
        a.assertIs(DataType.number, debugInfo)

        const types: DataType[] = []

        if (a.intersects(DataType.positiveInfinity)) {
          types.push(DataType.positiveInfinity)
        }
        if (a.intersects(DataType.negativeInfinity)) {
          types.push(DataType.negativeInfinity)
        }
        if (a.intersects(DataType.nan)) {
          types.push(DataType.nan)
        }

        if (a.intersects(DataType.zero)) {
          types.push(DataType.zero)
        }
        if (a.intersects(DataType.positiveFloat)) {
          types.push(DataType.nonNegativeInteger)
        }
        if (a.intersects(DataType.negativeFloat)) {
          types.push(DataType.nonPositiveInteger)
        }
        return DataType.or(...types)
      }
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

  'max-value': {
    evaluate: (): number => {
      return MAX_NUMBER
    },
    validate: (node: NormalExpressionNode): void => assertNumberOfParams(0, node),
  },

  'min-value': {
    evaluate: (): number => {
      return MIN_NUMBER
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
  paramTypes.every(type => type.assertIs(DataType.number, debugInfo))

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
    if (b.intersects(DataType.float)) {
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
    if (b.intersects(DataType.float)) {
      types.push(DataType.negativeInfinity)
    }
  }
  if (b.intersects(DataType.positiveInfinity)) {
    if (a.intersects(DataType.float)) {
      types.push(DataType.positiveInfinity)
    }
  }
  if (b.intersects(DataType.negativeInfinity)) {
    if (a.intersects(DataType.float)) {
      types.push(DataType.negativeInfinity)
    }
  }

  const baseType = a.isInteger() && b.isInteger() ? DataType.integer : DataType.float

  if (a.intersects(DataType.positiveFloat)) {
    if (b.intersects(DataType.zero)) {
      types.push(DataType.positiveFloat.and(baseType))
    }
    if (b.intersects(DataType.positiveFloat)) {
      types.push(DataType.positiveFloat.and(baseType))
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.negativeFloat)) {
      types.push(DataType.float.and(baseType))
    }
  }

  if (a.intersects(DataType.negativeFloat)) {
    if (b.intersects(DataType.zero)) {
      types.push(DataType.negativeFloat.and(baseType))
    }
    if (b.intersects(DataType.positiveFloat)) {
      types.push(DataType.float.and(baseType))
    }
    if (b.intersects(DataType.negativeFloat)) {
      types.push(DataType.negativeFloat.and(baseType))
      types.push(DataType.negativeInfinity)
    }
  }

  if (a.intersects(DataType.zero)) {
    if (b.intersects(DataType.zero)) {
      types.push(DataType.zero)
    }
    if (b.intersects(DataType.positiveFloat)) {
      types.push(DataType.positiveFloat.and(baseType))
    }
    if (b.intersects(DataType.negativeFloat)) {
      types.push(DataType.negativeFloat.and(baseType))
    }
  }

  return DataType.or(...types)
}

function getTypeOfProduct(paramTypes: DataType[]): DataType {
  if (paramTypes.length === 1) {
    return asValue(paramTypes[0])
  }

  const first = asValue(paramTypes[0])
  return paramTypes.slice(1).reduce((a: DataType, b) => getTypeOfBinaryProduct(a, b), first)
}

function getTypeOfBinaryProduct(a: DataType, b: DataType): DataType {
  const types: DataType[] = []
  if (a.or(b).intersects(DataType.zero)) {
    types.push(DataType.zero)
  }

  if (a.intersects(DataType.nan) && b.intersects(DataType.number.exclude(DataType.zero))) {
    types.push(DataType.nan)
  }
  if (b.intersects(DataType.nan) && a.intersects(DataType.number.exclude(DataType.zero))) {
    types.push(DataType.nan)
  }

  if (a.intersects(DataType.positiveInfinity)) {
    if (b.intersects(DataType.positiveInfinity) || b.intersects(DataType.positiveFloat)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.negativeInfinity) || b.intersects(DataType.negativeFloat)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (a.intersects(DataType.negativeInfinity)) {
    if (b.intersects(DataType.negativeInfinity) || b.intersects(DataType.negativeFloat)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.positiveInfinity) || b.intersects(DataType.positiveFloat)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (b.intersects(DataType.positiveInfinity)) {
    if (a.intersects(DataType.positiveFloat)) {
      types.push(DataType.positiveInfinity)
    }
    if (a.intersects(DataType.negativeFloat)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (b.intersects(DataType.negativeInfinity)) {
    if (a.intersects(DataType.positiveFloat)) {
      types.push(DataType.negativeInfinity)
    }
    if (a.intersects(DataType.negativeFloat)) {
      types.push(DataType.positiveInfinity)
    }
  }

  if (a.intersects(DataType.zero)) {
    if (b.intersects(DataType.float)) {
      types.push(DataType.zero)
    }
  }

  if (b.intersects(DataType.zero)) {
    if (a.intersects(DataType.float)) {
      types.push(DataType.zero)
    }
  }

  const baseType = a.isInteger() && b.isInteger() ? DataType.integer : DataType.float

  const aNeg = a.intersects(DataType.negativeFloat)
  const aPos = a.intersects(DataType.positiveFloat)
  const bNeg = b.intersects(DataType.negativeFloat)
  const bPos = b.intersects(DataType.positiveFloat)

  if ((aNeg && bNeg) || (aPos && bPos)) {
    types.push(DataType.positiveFloat.and(baseType))
    types.push(DataType.positiveInfinity)
  }

  if ((aNeg && bPos) || (aPos && bNeg)) {
    types.push(DataType.negativeFloat.and(baseType))
    types.push(DataType.negativeInfinity)
  }

  return DataType.or(...types)
}

function getTypeOfDivision(paramTypes: DataType[]): DataType {
  if (paramTypes.length === 1) {
    paramTypes.unshift(DataType.positiveInteger)
  }

  const first = asValue(paramTypes[0])
  return paramTypes.slice(1).reduce((a: DataType, b) => getTypeOfBinaryDivision(a, b), first)
}

function getTypeOfBinaryDivision(a: DataType, b: DataType): DataType {
  const types: DataType[] = []
  if (a.intersects(DataType.zero)) {
    types.push(DataType.zero)
  }
  if (b.intersects(DataType.infinity)) {
    types.push(DataType.zero)
  }

  if (a.intersects(DataType.nan) && b.intersects(DataType.number.exclude(DataType.infinity))) {
    types.push(DataType.nan)
  }
  if (b.intersects(DataType.nan) && a.intersects(DataType.number.exclude(DataType.zero))) {
    types.push(DataType.nan)
  }

  if (a.intersects(DataType.positiveInfinity)) {
    if (b.intersects(DataType.zero)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.positiveFloat)) {
      types.push(DataType.positiveInfinity)
    }
    if (b.intersects(DataType.negativeFloat)) {
      types.push(DataType.negativeInfinity)
    }
  }

  if (a.intersects(DataType.negativeInfinity)) {
    if (b.intersects(DataType.zero)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.positiveFloat)) {
      types.push(DataType.negativeInfinity)
    }
    if (b.intersects(DataType.negativeFloat)) {
      types.push(DataType.positiveInfinity)
    }
  }

  if (b.intersects(DataType.zero)) {
    if (a.intersects(DataType.positiveFloat)) {
      types.push(DataType.positiveInfinity)
    }
    if (a.intersects(DataType.negativeFloat)) {
      types.push(DataType.negativeInfinity)
    }
  }

  const aNeg = a.intersects(DataType.negativeFloat)
  const aPos = a.intersects(DataType.positiveFloat)
  const bNeg = b.intersects(DataType.negativeFloat)
  const bPos = b.intersects(DataType.positiveFloat)

  if ((aNeg && bNeg) || (aPos && bPos)) {
    types.push(DataType.positiveFloat)
    if (!b.isInteger()) {
      types.push(DataType.positiveInfinity)
    }
  }

  if ((aNeg && bPos) || (aPos && bNeg)) {
    types.push(DataType.negativeFloat)
    if (!b.isInteger()) {
      types.push(DataType.negativeInfinity)
    }
  }

  return DataType.or(...types)
}
