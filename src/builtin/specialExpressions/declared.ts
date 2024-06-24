import { AstNodeType, TokenType } from '../../constants/constants'
import type { CommonSpecialExpressionNode, NameNode } from '../../parser/interface'
import { assertNumberOfParams } from '../../typeGuards'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface DeclaredNode extends CommonSpecialExpressionNode<'declared?'> {}

export const declaredSpecialExpression: BuiltinSpecialExpression<boolean, DeclaredNode> = {
  parse: (tokenStream, position, firstToken, { parseTokensUntilClosingBracket }) => {
    const [newPosition, params] = parseTokensUntilClosingBracket(tokenStream, position)
    const lastToken = asToken(tokenStream.tokens[newPosition], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })

    const node: DeclaredNode = {
      t: AstNodeType.SpecialExpression,
      n: 'declared?',
      p: params,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
            lastToken,
          }
        : undefined,
    }

    assertNumberOfParams(1, node)

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack) => {
    const lookUpResult = contextStack.lookUp(node.p[0] as NameNode)
    return lookUpResult !== null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
