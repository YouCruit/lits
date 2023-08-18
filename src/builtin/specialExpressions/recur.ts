import { RecurSignal } from '../../errors'
import { AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const recurSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let params
    ;[position, params] = parseTokens(tokens, position)

    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `recur`,
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const params = node.p.map(paramNode => evaluateAstNode(paramNode, contextStack))
    throw new RecurSignal(params)
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
