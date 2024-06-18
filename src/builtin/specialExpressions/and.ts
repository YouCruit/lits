import type { Any } from '../../interface'
import { AstNodeType, TokenType } from '../../constants/constants'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { AstNode, GenericNode } from '../../parser/interface'

export interface AndNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'and'
  p: AstNode[]
}

export const andSpecialExpression: BuiltinSpecialExpression<Any, AndNode> = {
  parse: (tokenStream, position, firstToken, { parseTokensUntilClosingBracket }) => {
    const [newPosition, params] = parseTokensUntilClosingBracket(tokenStream, position)
    const lastToken = asToken(tokenStream.tokens[newPosition], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })

    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'and',
        p: params,
        debug: firstToken.sourceCodeInfo
          ? {
              token: firstToken,
              lastToken,
            }
          : undefined,
      } satisfies AndNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    let value: Any = true

    for (const param of node.p) {
      value = evaluateAstNode(param, contextStack)
      if (!value)
        break
    }

    return value
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
