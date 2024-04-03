import { UserDefinedError } from '../../errors'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenType } from '../../constants/constants'
import { asToken, assertToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { asString } from '../../typeGuards/string'

type ThrowNode = SpecialExpressionNode & {
  m: AstNode
}

export const throwSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokenStream, position, { parseToken }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, messageNode] = parseToken(tokenStream, position)
    position = newPosition

    assertToken(tokenStream.tokens[position], tokenStream.filePath, { type: TokenType.Bracket, value: `)` })
    position += 1

    const node: ThrowNode = {
      t: AstNodeType.SpecialExpression,
      n: `throw`,
      p: [],
      m: messageNode,
      tkn: firstToken.d ? firstToken : undefined,
    }
    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const message = asString(evaluateAstNode((node as ThrowNode).m, contextStack), node.tkn?.d, {
      nonEmpty: true,
    })
    throw new UserDefinedError(message, node.tkn?.d)
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst((node as ThrowNode).m, contextStack, builtin),
}
