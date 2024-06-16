import { UserDefinedError } from '../../errors'
import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode, GenericNode } from '../../parser/interface'
import { asToken, assertToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { asString } from '../../typeGuards/string'

export interface ThrowNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'throw'
  m: AstNode
}

export const throwSpecialExpression: BuiltinSpecialExpression<null, ThrowNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, messageNode] = parseToken(tokenStream, position)
    position = newPosition

    assertToken(tokenStream.tokens[position], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })
    position += 1

    const node: ThrowNode = {
      t: AstNodeType.SpecialExpression,
      n: 'throw',
      m: messageNode,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }
    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const message = asString(evaluateAstNode(node.m, contextStack), node.debug?.token.sourceCodeInfo, {
      nonEmpty: true,
    })
    throw new UserDefinedError(message, node.debug?.token.sourceCodeInfo)
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers([node.m], contextStack, builtin),
}
