import { AstNodeType, TokenType } from '../../constants/constants'
import type { GenericNode, NameNode } from '../../parser/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { asNameNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface DeclaredNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'declared?'
  p: NameNode
}

export const declaredSpecialExpression: BuiltinSpecialExpression<boolean, DeclaredNode> = {
  parse: (tokenStream, position, firstToken, { parseTokensUntilClosingBracket }) => {
    const [newPosition, params] = parseTokensUntilClosingBracket(tokenStream, position)
    const lastToken = asToken(tokenStream.tokens[newPosition], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })

    assertNumberOfParamsFromAstNodes({
      name: 'declared?',
      count: 1,
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })

    const node: DeclaredNode = {
      t: AstNodeType.SpecialExpression,
      n: 'declared?',
      p: asNameNode(params[0], firstToken.sourceCodeInfo),
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
            lastToken,
          }
        : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack) => {
    const lookUpResult = contextStack.lookUp(node.p)
    return lookUpResult !== null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers([node.p], contextStack, builtin),
}
