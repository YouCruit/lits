import { UserDefinedError } from '../../errors'
import { AstNodeType } from '../../parser/AstNodeType'
import { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenizerType } from '../../tokenizer/interface'
import { string, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

type ThrowNode = SpecialExpressionNode & {
  m: AstNode
}

export const throwSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, messageNode] = parseToken(tokens, position)
    position = newPosition

    token.assert(tokens[position], `EOF`, { type: TokenizerType.Bracket, value: `)` })
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
    const message = string.as(evaluateAstNode((node as ThrowNode).m, contextStack), node.tkn?.d, {
      nonEmpty: true,
    })
    throw new UserDefinedError(message, node.tkn?.d)
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst((node as ThrowNode).m, contextStack, builtin),
}
