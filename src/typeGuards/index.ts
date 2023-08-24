import { LitsError } from '../errors'
import type { UnknownRecord } from '../interface'
import type { NormalExpressionNode } from '../parser/interface'
import type { DebugInfo } from '../tokenizer/interface'
import { valueToString } from '../utils/debug/debugTools'
import { getDebugInfo } from '../utils/debug/getDebugInfo'

export function assertEventNumberOfParams(node: NormalExpressionNode): void {
  const length = node.p.length
  if (length % 2 !== 0) {
    throw new LitsError(
      `Wrong number of arguments, expected an even number, got ${valueToString(length)}.`,
      node.tkn?.d,
    )
  }
}

export function isNonUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function asNonUndefined<T>(value: T | undefined, debugInfo?: DebugInfo): T {
  assertNonUndefined(value, debugInfo)
  return value
}

export function assertNonUndefined<T>(value: T | undefined, debugInfo?: DebugInfo): asserts value is T {
  if (!isNonUndefined(value)) {
    throw new LitsError(`Unexpected undefined`, getDebugInfo(value, debugInfo))
  }
}

/* istanbul ignore next */
export function assertUnreachable(_: never): never {
  throw new Error(`This should not be reached`)
}

export function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === `object` && !Array.isArray(value)
}

export function assertUnknownRecord(value: unknown, debugInfo?: DebugInfo): asserts value is UnknownRecord {
  if (!isUnknownRecord(value)) {
    throw new LitsError(`Expected ${`UnknownRecord`}, got ${valueToString(value)}.`, getDebugInfo(value, debugInfo))
  }
}

export function asUnknownRecord(value: unknown, debugInfo?: DebugInfo): UnknownRecord {
  assertUnknownRecord(value, debugInfo)
  return value
}
