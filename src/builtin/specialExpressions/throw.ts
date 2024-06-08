import { UserDefinedError } from '../../errors'
import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import { asToken, assertToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { asString } from '../../typeGuards/string'
import type { Token } from '../../tokenizer/interface'

export interface ThrowNode {
  t: AstNodeType.SpecialExpression
  n: 'throw'
  p: AstNode[]
  m: AstNode
  tkn?: Token
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
      p: [],
      m: messageNode,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }
    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const message = asString(evaluateAstNode(node.m, contextStack), node.tkn?.sourceCodeInfo, {
      nonEmpty: true,
    })
    throw new UserDefinedError(message, node.tkn?.sourceCodeInfo)
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers([node.m], contextStack, builtin),
}
