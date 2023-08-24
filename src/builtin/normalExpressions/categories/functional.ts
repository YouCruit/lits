import { FunctionType } from '../../../constants/constants'
import type { Any, Arr } from '../../../interface'
import type {
  ComplementFunction,
  CompFunction,
  ConstantlyFunction,
  EveryPredFunction,
  JuxtFunction,
  PartialFunction,
  SomePredFunction,
  FNilFunction,
} from '../../../parser/interface'
import { assertNumberOfParams, toAny } from '../../../utils'
import { assertLitsFunction } from '../../../typeGuards/function'
import { FUNCTION_SYMBOL } from '../../../utils/symbols'
import type { BuiltinNormalExpressions } from '../../interface'
import { assertArray } from '../../../typeGuards/array'
export const functionalNormalExpression: BuiltinNormalExpressions = {
  apply: {
    evaluate: ([func, ...params]: Arr, debugInfo, contextStack, { executeFunction }): Any => {
      assertLitsFunction(func, debugInfo)
      const paramsLength = params.length
      const last = params[paramsLength - 1]
      assertArray(last, debugInfo)
      const applyArray = [...params.slice(0, -1), ...last]
      return executeFunction(func, applyArray, contextStack, debugInfo)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },

  identity: {
    evaluate: ([value]): Any => {
      return toAny(value)
    },
    validate: node => assertNumberOfParams(1, node),
  },

  partial: {
    evaluate: ([fn, ...params], debugInfo): PartialFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Partial,
        f: toAny(fn),
        p: params,
      }
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  comp: {
    evaluate: (fns, debugInfo): CompFunction => {
      if (fns.length > 1) {
        const last = fns[fns.length - 1]
        if (Array.isArray(last)) {
          fns = [...fns.slice(0, -1), ...last]
        }
      }
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Comp,
        f: fns,
      }
    },
  },

  constantly: {
    evaluate: ([value], debugInfo): ConstantlyFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Constantly,
        v: toAny(value),
      }
    },
    validate: node => assertNumberOfParams(1, node),
  },

  juxt: {
    evaluate: (fns, debugInfo): JuxtFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Juxt,
        f: fns,
      }
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  complement: {
    evaluate: ([fn], debugInfo): ComplementFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Complement,
        f: toAny(fn),
      }
    },
    validate: node => assertNumberOfParams(1, node),
  },

  'every-pred': {
    evaluate: (fns, debugInfo): EveryPredFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.EveryPred,
        f: fns,
      }
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  'some-pred': {
    evaluate: (fns, debugInfo): SomePredFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.SomePred,
        f: fns,
      }
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  fnil: {
    evaluate: ([fn, ...params], debugInfo): FNilFunction => {
      return {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Fnil,
        f: toAny(fn),
        p: params,
      }
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
}
