import type { DebugInfo } from '../tokenizer/interface'
import { getAssertionError } from '../utils/getAssertionError'

// isArray not needed, use Array.isArary
export function asArray(value: unknown, debugInfo?: DebugInfo): unknown[] {
  assertArray(value, debugInfo)
  return value
}
export function assertArray(value: unknown, debugInfo?: DebugInfo): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw getAssertionError(`array`, value, debugInfo)
  }
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === `string`)
}
export function asStringArray(value: unknown, debugInfo?: DebugInfo): string[] {
  assertStringArray(value, debugInfo)
  return value
}
export function assertStringArray(value: unknown, debugInfo?: DebugInfo): asserts value is string[] {
  if (!isStringArray(value)) {
    throw getAssertionError(`array of strings`, value, debugInfo)
  }
}

export function isCharArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === `string` && v.length === 1)
}
export function asCharArray(value: unknown, debugInfo?: DebugInfo): string[] {
  assertCharArray(value, debugInfo)
  return value
}
export function assertCharArray(value: unknown, debugInfo?: DebugInfo): asserts value is string[] {
  if (!isCharArray(value)) {
    throw getAssertionError(`array of strings`, value, debugInfo)
  }
}
