import { Any } from '../../interface'
import { AstNodeType } from '../../parser/AstNodeType'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const whenNotSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `when-not`,
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [whenExpression, ...body] = node.p
    astNode.assert(whenExpression, node.tkn?.d)

    if (evaluateAstNode(whenExpression, contextStack)) {
      return null
    }

    let result: Any = null
    for (const form of body) {
      result = evaluateAstNode(form, contextStack)
    }
    return result
  },
  validate: node => assertNumberOfParams({ min: 1 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
