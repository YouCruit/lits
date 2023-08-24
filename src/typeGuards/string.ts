import { LitsError } from '../errors'
import type { DebugInfo } from '../tokenizer/interface'
import { getAssertionError } from '../utils/getAssertionError'

type StringAssertionOptions =
  | {
      nonEmpty?: true
      char?: never
    }
  | {
      nonEmpty?: never
      char?: true
    }

export function isString(value: unknown, options: StringAssertionOptions = {}): value is string {
  if (typeof value !== `string`) {
    return false
  }

  if (options.nonEmpty && value.length === 0) {
    return false
  }

  if (options.char && value.length !== 1) {
    return false
  }

  return true
}

export function assertString(
  value: unknown,
  debugInfo: DebugInfo | undefined,
  options: StringAssertionOptions = {},
): asserts value is string {
  if (!isString(value, options)) {
    throw new LitsError(
      getAssertionError(
        `${options.nonEmpty ? `non empty string` : options.char ? `character` : `string`}`,
        value,
        debugInfo,
      ),
    )
  }
}

export function asString(
  value: unknown,
  debugInfo: DebugInfo | undefined,
  options: StringAssertionOptions = {},
): string {
  assertString(value, debugInfo, options)
  return value
}

export function isStringOrNumber(value: unknown): value is string | number {
  return typeof value === `string` || typeof value === `number`
}
export function asStringOrNumber(value: unknown, debugInfo?: DebugInfo): string | number {
  assertStringOrNumber(value, debugInfo)
  return value
}
export function assertStringOrNumber(value: unknown, debugInfo?: DebugInfo): asserts value is string | number {
  if (!isStringOrNumber(value)) {
    throw getAssertionError(`string or number`, value, debugInfo)
  }
}
