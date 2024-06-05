import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import { asToken, isToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { Token } from '../../tokenizer/interface'
import type { SpecialExpressionNode } from '..'

export interface DoNode {
  t: AstNodeType.SpecialExpression
  n: 'do'
  p: AstNode[] // params
  tkn?: Token
}

export const doSpecialExpression: BuiltinSpecialExpression<Any, DoNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    let tkn = asToken(tokenStream.tokens[position], tokenStream.filePath)

    const node: DoNode = {
      t: AstNodeType.SpecialExpression,
      n: 'do',
      p: [],
      tkn: tkn.sourceCodeInfo ? tkn : undefined,
    }

    while (!isToken(tkn, { type: TokenType.Bracket, value: ')' })) {
      let bodyNode: AstNode
      ;[position, bodyNode] = parseToken(tokenStream, position)
      node.p.push(bodyNode)
      tkn = asToken(tokenStream.tokens[position], tokenStream.filePath)
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const newContext: Context = {}

    const newContextStack = contextStack.create(newContext)
    let result: Any = null
    for (const form of node.p)
      result = evaluateAstNode(form, newContextStack)

    return result
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
