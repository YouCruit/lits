import { getAssertionError } from '../utils/getAssertionError'
import type { LitsFunction, NativeJsFunction, UserDefinedFunction } from '../parser/interface'
import type { SourceCodeInfo } from '../tokenizer/interface'
import { FUNCTION_SYMBOL } from '../utils/symbols'
import { FunctionType } from '../constants/constants'

export function isLitsFunction(value: unknown): value is LitsFunction {
  if (value === null || typeof value !== `object`)
    return false

  return !!(value as LitsFunction)[FUNCTION_SYMBOL]
}
export function asLitsFunction(value: unknown, sourceCodeInfo?: SourceCodeInfo): LitsFunction {
  assertLitsFunction(value, sourceCodeInfo)
  return value
}
export function assertLitsFunction(value: unknown, sourceCodeInfo?: SourceCodeInfo): asserts value is LitsFunction {
  if (!isLitsFunction(value))
    throw getAssertionError(`LitsFunction`, value, sourceCodeInfo)
}

export function isUserDefinedFunction(value: unknown): value is UserDefinedFunction {
  return isLitsFunction(value) && value.t === FunctionType.UserDefined
}
export function asUserDefinedFunction(value: unknown, sourceCodeInfo?: SourceCodeInfo): UserDefinedFunction {
  assertUserDefinedFunction(value, sourceCodeInfo)
  return value
}
export function assertUserDefinedFunction(
  value: unknown,
  sourceCodeInfo?: SourceCodeInfo,
): asserts value is UserDefinedFunction {
  if (!isUserDefinedFunction(value))
    throw getAssertionError(`NativeJsFunction`, value, sourceCodeInfo)
}

export function isNativeJsFunction(value: unknown): value is NativeJsFunction {
  return isLitsFunction(value) && value.t === FunctionType.NativeJsFunction
}
export function asNativeJsFunction(value: unknown, sourceCodeInfo?: SourceCodeInfo): NativeJsFunction {
  assertNativeJsFunction(value, sourceCodeInfo)
  return value
}
export function assertNativeJsFunction(
  value: unknown,
  sourceCodeInfo?: SourceCodeInfo,
): asserts value is NativeJsFunction {
  if (!isNativeJsFunction(value))
    throw getAssertionError(`NativeJsFunction`, value, sourceCodeInfo)
}
