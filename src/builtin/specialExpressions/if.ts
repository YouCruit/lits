import { AstNodeType, TokenType } from '../../constants/constants'
import type { Any } from '../../interface'
import type { AstNode, GenericNode } from '../../parser/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { asAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface IfNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'if'
  p: AstNode[]
}

export const ifSpecialExpression: BuiltinSpecialExpression<Any, IfNode> = {
  parse: (tokenStream, position, firstToken, { parseTokensUntilClosingBracket }) => {
    const [newPosition, params] = parseTokensUntilClosingBracket(tokenStream, position)
    const lastToken = asToken(tokenStream.tokens[newPosition], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })

    assertNumberOfParamsFromAstNodes({
      name: 'if',
      count: { min: 2, max: 3 },
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'if',
        p: params,
        debug: firstToken.sourceCodeInfo
          ? {
              token: firstToken,
              lastToken
            }
          : undefined,
      } satisfies IfNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const sourceCodeInfo = node.debug?.token.sourceCodeInfo

    const [conditionNode, trueNode, falseNode] = node.p
    if (evaluateAstNode(asAstNode(conditionNode, sourceCodeInfo), contextStack)) {
      return evaluateAstNode(asAstNode(trueNode, sourceCodeInfo), contextStack)
    }
    else {
      if (node.p.length === 3)
        return evaluateAstNode(asAstNode(falseNode, sourceCodeInfo), contextStack)
      else
        return null
    }
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
