import { isAstNodeType } from '../parser/AstNodeType'
import type { AstNode, LitsFunction, RegularExpression } from '../parser/interface'
import { DebugInfo, SourceCodeInfo, Token, isTokenType } from '../tokenizer/interface'
import { FUNCTION_SYMBOL, REGEXP_SYMBOL } from './symbols'

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function getDebugInfo(anyValue: any, debugInfo?: DebugInfo): DebugInfo | undefined {
  return anyValue?.d ?? debugInfo
}

export function getCodeMarker(sourceCodeInfo: SourceCodeInfo): string {
  const leftPadding = sourceCodeInfo.column - 1
  const rightPadding = sourceCodeInfo.code.length - leftPadding - 1
  return `${` `.repeat(Math.max(leftPadding, 0))}^${` `.repeat(Math.max(rightPadding, 0))}`
}

export function valueToString(value: unknown): string {
  if (isLitsFunction(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `<function ${(value as any).name || `λ`}>`
  }
  if (isToken(value)) {
    return `${value.t}-token "${value.v}"`
  }
  if (isAstNode(value)) {
    return `${value.t}-node`
  }
  if (value === null) {
    return `null`
  }
  if (typeof value === `object` && value instanceof RegExp) {
    return `${value}`
  }
  if (typeof value === `object` && value instanceof Error) {
    return value.toString()
  }
  return JSON.stringify(value)
}

export function isToken(value: unknown): value is Token {
  if (typeof value !== `object` || value === null) {
    return false
  }

  const tkn = value as Token
  if (typeof tkn.v !== `string`) {
    return false
  }

  return isTokenType(tkn.t)
}

export function isAstNode(value: unknown): value is AstNode {
  if (value === null || typeof value !== `object`) {
    return false
  }
  if (!isAstNodeType((value as AstNode).t)) {
    return false
  }
  return true
}

export function isLitsFunction(func: unknown): func is LitsFunction {
  if (func === null || typeof func !== `object`) {
    return false
  }
  return !!(func as LitsFunction)[FUNCTION_SYMBOL]
}

export function isRegularExpression(regexp: unknown): regexp is RegularExpression {
  if (regexp === null || typeof regexp !== `object`) {
    return false
  }
  return !!(regexp as RegularExpression)[REGEXP_SYMBOL]
}
