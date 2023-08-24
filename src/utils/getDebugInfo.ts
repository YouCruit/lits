import type { DebugInfo } from '../tokenizer/interface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDebugInfo(anyValue: any, debugInfo?: DebugInfo): DebugInfo | undefined {
  return anyValue?.d ?? debugInfo
}
