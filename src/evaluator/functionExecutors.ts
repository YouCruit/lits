import { normalExpressions } from '../builtin/normalExpressions'
import { LitsError, RecurSignal } from '../errors'
import { Any, Arr } from '../interface'
import {
  BuiltinFunction,
  CompFunction,
  ComplementFunction,
  ConstantlyFunction,
  EvaluatedFunctionOverload,
  EveryPredFunction,
  FNilFunction,
  FunctionType,
  JuxtFunction,
  LitsFunctionType,
  PartialFunction,
  SomePredFunction,
  UserDefinedFunction,
} from '../parser/interface'
import { DebugInfo } from '../tokenizer/interface'
import { toAny } from '../utils'
import { any, asValue, string } from '../utils/assertion'
import { valueToString } from '../utils/helpers'
import { Context, ContextStack, EvaluateAstNode, ExecuteFunction } from './interface'

type FunctionExecutors = Record<
  LitsFunctionType,
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: any,
    params: Arr,
    debugInfo: DebugInfo | undefined,
    contextStack: ContextStack,
    helpers: { evaluateAstNode: EvaluateAstNode; executeFunction: ExecuteFunction },
  ) => Any
>

function findOverloadFunction(
  overloads: EvaluatedFunctionOverload[],
  nbrOfParams: number,
  debugInfo?: DebugInfo,
): EvaluatedFunctionOverload {
  const overloadFunction = overloads.find(overload => {
    const arity = overload.a
    if (typeof arity === `number`) {
      return arity === nbrOfParams
    } else {
      return arity.min <= nbrOfParams
    }
  })
  if (!overloadFunction) {
    throw new LitsError(`Unexpected number of arguments, got ${valueToString(nbrOfParams)}.`, debugInfo)
  }
  return overloadFunction
}

export const functionExecutors: FunctionExecutors = {
  [FunctionType.UserDefined]: (fn: UserDefinedFunction, params, debugInfo, contextStack, { evaluateAstNode }) => {
    for (;;) {
      const overloadFunction = findOverloadFunction(fn.o, params.length, debugInfo)
      const args = overloadFunction.as
      const nbrOfMandatoryArgs: number = args.mandatoryArguments.length

      const newContext: Context = { ...overloadFunction.f }

      const length = Math.max(params.length, args.mandatoryArguments.length)
      const rest: Arr = []
      for (let i = 0; i < length; i += 1) {
        if (i < nbrOfMandatoryArgs) {
          const param = toAny(params[i])
          const key = string.as(args.mandatoryArguments[i], debugInfo)
          newContext[key] = { value: param }
        } else {
          rest.push(toAny(params[i]))
        }
      }

      if (args.restArgument) {
        newContext[args.restArgument] = { value: rest }
      }

      try {
        let result: Any = null
        for (const node of overloadFunction.b) {
          result = evaluateAstNode(node, contextStack.withContext(newContext))
        }
        return result
      } catch (error) {
        if (error instanceof RecurSignal) {
          params = error.params
          continue
        }
        throw error
      }
    }
  },
  [FunctionType.Partial]: (fn: PartialFunction, params, debugInfo, contextStack, { executeFunction }) => {
    return executeFunction(fn.f, [...fn.p, ...params], contextStack, debugInfo)
  },
  [FunctionType.Comp]: (fn: CompFunction, params, debugInfo, contextStack, { executeFunction }) => {
    const { f } = fn
    if (f.length === 0) {
      if (params.length !== 1) {
        throw new LitsError(`(comp) expects one argument, got ${valueToString(params.length)}.`, debugInfo)
      }
      return any.as(params[0], debugInfo)
    }
    return any.as(
      f.reduceRight((result: Arr, fn) => {
        return [executeFunction(toAny(fn), result, contextStack, debugInfo)]
      }, params)[0],
      debugInfo,
    )
  },
  [FunctionType.Constantly]: (fn: ConstantlyFunction) => {
    return fn.v
  },
  [FunctionType.Juxt]: (fn: JuxtFunction, params, debugInfo, contextStack, { executeFunction }) => {
    return fn.f.map(fn => executeFunction(toAny(fn), params, contextStack, debugInfo))
  },
  [FunctionType.Complement]: (fn: ComplementFunction, params, debugInfo, contextStack, { executeFunction }) => {
    return !executeFunction(fn.f, params, contextStack, debugInfo)
  },
  [FunctionType.EveryPred]: (fn: EveryPredFunction, params, debugInfo, contextStack, { executeFunction }) => {
    for (const f of fn.f) {
      for (const param of params) {
        const result = executeFunction(toAny(f), [param], contextStack, debugInfo)
        if (!result) {
          return false
        }
      }
    }
    return true
  },
  [FunctionType.SomePred]: (fn: SomePredFunction, params, debugInfo, contextStack, { executeFunction }) => {
    for (const f of fn.f) {
      for (const param of params) {
        const result = executeFunction(toAny(f), [param], contextStack, debugInfo)
        if (result) {
          return true
        }
      }
    }
    return false
  },
  [FunctionType.Fnil]: (fn: FNilFunction, params, debugInfo, contextStack, { executeFunction }) => {
    const fniledParams = params.map((param, index) => (param === null ? toAny(fn.p[index]) : param))
    return executeFunction(toAny(fn.f), fniledParams, contextStack, debugInfo)
  },
  [FunctionType.Builtin]: (fn: BuiltinFunction, params, debugInfo, contextStack, { executeFunction }) => {
    const normalExpression = asValue(normalExpressions[fn.n], debugInfo)
    return normalExpression.evaluate(params, debugInfo, contextStack, { executeFunction })
  },
}
