import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode, GenericNode } from '../../parser/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { assertString } from '../../typeGuards/string'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

export interface DefsNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'defs'
  p: [AstNode, AstNode]
}

export const defsSpecialExpression: BuiltinSpecialExpression<null, DefsNode> = {
  parse: (tokenStream, position, firstToken, { parseTokensUntilClosingBracket }) => {
    const [newPosition, params] = parseTokensUntilClosingBracket(tokenStream, position)
    const lastToken = asToken(tokenStream.tokens[newPosition], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })

    assertNumberOfParamsFromAstNodes({
      name: 'defs',
      count: 2,
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'defs',
        p: [params[0]!, params[1]!],
        debug: firstToken.sourceCodeInfo
          ? {
              token: firstToken,
              lastToken
            }
          : undefined,
      } satisfies DefsNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const sourceCodeInfo = node.debug?.token.sourceCodeInfo
    const name = evaluateAstNode(node.p[0], contextStack)
    assertString(name, sourceCodeInfo)

    assertNameNotDefined(name, contextStack, builtin, node.debug?.token.sourceCodeInfo)

    contextStack.globalContext[name] = {
      value: evaluateAstNode(node.p[1], contextStack),
    }

    return null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin, evaluateAstNode }) => {
    const sourceCodeInfo = node.debug?.token.sourceCodeInfo
    const subNode = node.p[1]
    const result = findUnresolvedIdentifiers([subNode], contextStack, builtin)
    const name = evaluateAstNode(node.p[0], contextStack)
    assertString(name, sourceCodeInfo)
    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}
