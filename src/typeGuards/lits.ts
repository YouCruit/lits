import type { Any, Coll, Obj, Seq } from '../interface'
import type { RegularExpression } from '../parser/interface'
import type { DebugInfo } from '../tokenizer/interface'
import { getAssertionError } from '../utils/getAssertionError'
import { REGEXP_SYMBOL } from '../utils/symbols'
import { isLitsFunction } from './litsFunction'

export function isAny(value: unknown): value is Any {
  // TODO weak test
  return value !== undefined
}
export function asAny(value: unknown, debugInfo?: DebugInfo): Any {
  assertAny(value, debugInfo)
  return value
}
export function assertAny(value: unknown, debugInfo?: DebugInfo): asserts value is Any {
  if (!isAny(value)) {
    throw getAssertionError(`not undefined`, value, debugInfo)
  }
}

export function isSeq(value: unknown): value is Seq {
  return Array.isArray(value) || typeof value === `string`
}
export function asSeq(value: unknown, debugInfo?: DebugInfo): Seq {
  assertSeq(value, debugInfo)
  return value
}
export function assertSeq(value: unknown, debugInfo?: DebugInfo): asserts value is Seq {
  if (!isSeq(value)) {
    throw getAssertionError(`string or array`, value, debugInfo)
  }
}

export function isObj(value: unknown): value is Obj {
  return !(
    value === null ||
    typeof value !== `object` ||
    Array.isArray(value) ||
    value instanceof RegExp ||
    isLitsFunction(value) ||
    isRegularExpression(value)
  )
}
export function asObj(value: unknown, debugInfo?: DebugInfo): Obj {
  assertObj(value, debugInfo)
  return value
}
export function assertObj(value: unknown, debugInfo?: DebugInfo): asserts value is Obj {
  if (!isObj(value)) {
    throw getAssertionError(`object`, value, debugInfo)
  }
}

export function isColl(value: unknown): value is Coll {
  return isSeq(value) || isObj(value)
}
export function asColl(value: unknown, debugInfo?: DebugInfo): Coll {
  assertColl(value, debugInfo)
  return value
}
export function assertColl(value: unknown, debugInfo?: DebugInfo): asserts value is Coll {
  if (!isColl(value)) {
    throw getAssertionError(`string, array or object`, value, debugInfo)
  }
}

export function isRegularExpression(regexp: unknown): regexp is RegularExpression {
  if (regexp === null || typeof regexp !== `object`) {
    return false
  }
  return !!(regexp as RegularExpression)[REGEXP_SYMBOL]
}
export function asRegularExpression(value: unknown, debugInfo?: DebugInfo): RegularExpression {
  assertRegularExpression(value, debugInfo)
  return value
}
export function assertRegularExpression(value: unknown, debugInfo?: DebugInfo): asserts value is RegularExpression {
  if (!isRegularExpression(value)) {
    throw getAssertionError(`RegularExpression`, value, debugInfo)
  }
}

export function isStringOrRegularExpression(value: unknown): value is string | RegularExpression {
  return isRegularExpression(value) || typeof value === `string`
}
export function asStringOrRegularExpression(value: unknown, debugInfo?: DebugInfo): string | RegularExpression {
  assertStringOrRegularExpression(value, debugInfo)
  return value
}
export function assertStringOrRegularExpression(
  value: unknown,
  debugInfo?: DebugInfo,
): asserts value is string | RegularExpression {
  if (!isStringOrRegularExpression(value)) {
    throw getAssertionError(`string or RegularExpression`, value, debugInfo)
  }
}
