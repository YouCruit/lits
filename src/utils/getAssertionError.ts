import { LitsError } from '../errors'
import type { DebugInfo } from '../tokenizer/interface'
import { valueToString } from './debugTools'
import { getDebugInfo } from './getDebugInfo'

export function getAssertionError(typeName: string, value: unknown, debugInfo?: DebugInfo): LitsError {
  return new LitsError(`Expected ${typeName}, got ${valueToString(value)}.`, getDebugInfo(value, debugInfo))
}
