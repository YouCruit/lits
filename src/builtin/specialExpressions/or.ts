import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { AstNode, GenericNode } from '../../parser/interface'

export interface OrNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'or'
  p: AstNode[]
}

export const orSpecialExpression: BuiltinSpecialExpression<Any, OrNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'or',
        p: params,
        debug: firstToken.sourceCodeInfo
          ? {
              token: firstToken,
            }
          : undefined,
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
