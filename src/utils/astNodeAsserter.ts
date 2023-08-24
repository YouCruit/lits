import { getAssertionError } from './getAssertionError'
import { isAstNodeType, AstNodeType } from '../constants/constants'
import type { AstNode, NameNode, NormalExpressionNode, NormalExpressionNodeWithName } from '../parser/interface'
import type { DebugInfo } from '../tokenizer/interface'

export function isAstNode(value: unknown): value is AstNode {
  if (value === null || typeof value !== `object`) {
    return false
  }
  if (!isAstNodeType((value as AstNode).t)) {
    return false
  }
  return true
}
export function asAstNode(value: unknown, debugInfo?: DebugInfo): AstNode {
  assertAstNode(value, debugInfo)
  return value
}
export function assertAstNode(value: unknown, debugInfo?: DebugInfo): asserts value is AstNode {
  if (!isAstNode(value)) {
    throw getAssertionError(`AstNode`, value, debugInfo)
  }
}

export function isNameNode(value: unknown): value is NameNode {
  if (!isAstNode(value)) {
    return false
  }
  return value.t === AstNodeType.Name
}
export function asNameNode(value: unknown, debugInfo?: DebugInfo): NameNode {
  assertNameNode(value, debugInfo)
  return value
}
export function assertNameNode(value: unknown, debugInfo?: DebugInfo): asserts value is NameNode {
  if (!isNameNode(value)) {
    throw getAssertionError(`NameNode`, value, debugInfo)
  }
}

export function isNormalExpressionNode(value: unknown): value is NormalExpressionNode {
  if (!isAstNode(value)) {
    return false
  }
  return value.t === AstNodeType.NormalExpression
}
export function asNormalExpressionNode(value: unknown, debugInfo?: DebugInfo): NormalExpressionNode {
  assertNormalExpressionNode(value, debugInfo)
  return value
}
export function assertNormalExpressionNode(
  value: unknown,
  debugInfo?: DebugInfo,
): asserts value is NormalExpressionNode {
  if (!isNormalExpressionNode(value)) {
    throw getAssertionError(`NormalExpressionNode`, value, debugInfo)
  }
}

export function isNormalExpressionNodeWithName(value: unknown): value is NormalExpressionNodeWithName {
  if (!isAstNode(value)) {
    return false
  }
  return value.t === AstNodeType.NormalExpression && typeof value.n === `string`
}
export function asNormalExpressionNodeWithName(value: unknown, debugInfo?: DebugInfo): NormalExpressionNodeWithName {
  assertNormalExpressionNodeWithName(value, debugInfo)
  return value
}
export function assertNormalExpressionNodeWithName(
  value: unknown,
  debugInfo?: DebugInfo,
): asserts value is NormalExpressionNodeWithName {
  if (!isNormalExpressionNodeWithName(value)) {
    throw getAssertionError(`NormalExpressionNodeWithName`, value, debugInfo)
  }
}
