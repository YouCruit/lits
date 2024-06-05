import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { AstNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import type { SpecialExpressionNode } from '..'

export interface OrNode {
  t: AstNodeType.SpecialExpression
  n: 'or'
  p: AstNode[]
  tkn?: Token
}

export const orSpecialExpression: BuiltinSpecialExpression<Any, OrNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'or',
        p: params,
        tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
      } satisfies OrNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    let value: Any = false

    for (const param of node.p) {
      value = evaluateAstNode(param, contextStack)
      if (value)
        break
    }

    return value
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
