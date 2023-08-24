import { getAssertionError } from '../utils/getAssertionError'
import type { LitsFunction } from '../parser/interface'
import type { DebugInfo } from '../tokenizer/interface'
import { FUNCTION_SYMBOL } from '../utils/symbols'

export function isLitsFunction(func: unknown): func is LitsFunction {
  if (func === null || typeof func !== `object`) {
    return false
  }
  return !!(func as LitsFunction)[FUNCTION_SYMBOL]
}
export function asLitsFunction(value: unknown, debugInfo?: DebugInfo): LitsFunction {
  assertLitsFunction(value, debugInfo)
  return value
}
export function assertLitsFunction(value: unknown, debugInfo?: DebugInfo): asserts value is LitsFunction {
  if (!isLitsFunction(value)) {
    throw getAssertionError(`LitsFunction`, value, debugInfo)
  }
}
