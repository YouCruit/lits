import { isTokenType, type TokenType } from '../constants/constants'
import { LitsError } from '../errors'
import type { Token, DebugInfo } from '../tokenizer/interface'
import { valueToString } from './debugTools'
import { getDebugInfo } from './getDebugInfo'

type TokenAssertionOptions =
  | {
      type: TokenType
      value?: string
    }
  | {
      type?: never
      value?: never
    }

export function isToken(value: unknown, options: TokenAssertionOptions = {}): value is Token {
  if (typeof value !== `object` || value === null) {
    return false
  }

  const tkn = value as Token
  if (typeof tkn.v !== `string`) {
    return false
  }

  if (!isTokenType(tkn.t)) {
    return false
  }

  if (options.type && tkn.t !== options.type) {
    return false
  }

  if (options.value && tkn.v !== options.value) {
    return false
  }

  return true
}

export function assertToken(
  value: unknown,
  debugInfo: DebugInfo | undefined,
  options: TokenAssertionOptions = {},
): asserts value is Token {
  if (!isToken(value, options)) {
    if (isToken(value)) {
      debugInfo = value.d
    }

    throw new LitsError(
      `Expected ${options.type ? `${options.type}-` : ``}token${
        typeof options.value === `string` ? ` value='${options.value}'` : ``
      }, got ${valueToString(value)}.`,
      getDebugInfo(value, debugInfo),
    )
  }
}

export function asToken(value: unknown, debugInfo: DebugInfo, options: TokenAssertionOptions = {}): Token {
  assertToken(value, debugInfo, options)
  return value
}
