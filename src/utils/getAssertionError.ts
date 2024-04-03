import { LitsError } from '../errors'
import type { SourceCodeInfo } from '../tokenizer/interface'
import { valueToString } from './debug/debugTools'
import { getDebugInfo } from './debug/getDebugInfo'

export function getAssertionError(typeName: string, value: unknown, sourceCodeInfo?: SourceCodeInfo): LitsError {
  return new LitsError(`Expected ${typeName}, got ${valueToString(value)}.`, getDebugInfo(value, sourceCodeInfo))
}
