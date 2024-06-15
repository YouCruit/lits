import { AstNodeType } from '../constants/constants'
import type { Ast, AstNode } from '../parser/interface'
import { UnparseOptions } from './UnparseOptions'
import { unparseNormalExpressionNode } from './unparseNormalExpression'
import { applyMetaTokens } from './utils'

export type Unparse = (node: AstNode, options: UnparseOptions) => string

const unparse: Unparse = (node: AstNode, options: UnparseOptions) => {
  switch (node.t) {
    case AstNodeType.String:
      return node.tkn?.o?.s
        ? applyMetaTokens(`:${node.v}`, node.tkn.metaTokens, options) // Keyword
        : applyMetaTokens(`"${node.v}"`, node.tkn?.metaTokens, options)
    case AstNodeType.Number:
    case AstNodeType.Name:
    case AstNodeType.Modifier:
    case AstNodeType.ReservedName:
      return applyMetaTokens(node.v, node.tkn?.metaTokens, options)
    case AstNodeType.Comment:
      return `${applyMetaTokens(node.v, node.tkn?.metaTokens, options)}\n`
    case AstNodeType.NormalExpression: {
      return unparseNormalExpressionNode(node, options)
    }
    case AstNodeType.SpecialExpression:
      throw new Error('Not implemented')
  }
}

export function unparseAst(ast: Ast, lineLength?: number): string {
  const options = new UnparseOptions(unparse, lineLength || Number.MAX_SAFE_INTEGER)
  const result = ast.b.map((node) => {
    return unparse(node, options)
  }).join('\n')
  return result.endsWith('\n') ? result : `${result}\n`
}
