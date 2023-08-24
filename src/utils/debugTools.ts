import { astNodeTypeName, isAstNodeType, isFunctionType, isTokenType, tokenTypeName } from '../constants/constants'
import type { AstNode, LitsFunction } from '../parser/interface'
import type { SourceCodeInfo, Token } from '../tokenizer/interface'
import { FUNCTION_SYMBOL } from './symbols'

function isLitsFunction(func: unknown): func is LitsFunction {
  if (!isUnknownRecord(func)) {
    return false
  }
  return !!func[FUNCTION_SYMBOL] && isFunctionType(func.t)
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === `object` && value !== null
}

function isToken(value: unknown): value is Token {
  return isUnknownRecord(value) && isTokenType(value.t) && typeof value.v === `string`
}

function isAstNode(value: unknown): value is AstNode {
  return isUnknownRecord(value) && isAstNodeType(value.t)
}

export function valueToString(value: unknown): string {
  if (isLitsFunction(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `<function ${(value as any).name || `λ`}>`
  }
  if (isToken(value)) {
    return `${tokenTypeName.get(value.t)}-token "${value.v}"`
  }
  if (isAstNode(value)) {
    return `${astNodeTypeName.get(value.t)}-node`
  }
  if (value === null) {
    return `nil`
  }
  if (typeof value === `object` && value instanceof RegExp) {
    return `${value}`
  }
  if (typeof value === `object` && value instanceof Error) {
    return value.toString()
  }
  return JSON.stringify(value)
}

export function getCodeMarker(sourceCodeInfo: SourceCodeInfo): string {
  const leftPadding = sourceCodeInfo.column - 1
  const rightPadding = sourceCodeInfo.code.length - leftPadding - 1
  return `${` `.repeat(Math.max(leftPadding, 0))}^${` `.repeat(Math.max(rightPadding, 0))}`
}
