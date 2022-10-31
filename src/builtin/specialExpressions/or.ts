import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface OrSpecialExpressionNode extends SpecialExpressionNode {
  name: `and`
}

export const orSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        type: `SpecialExpression`,
        name: `or`,
        params,
        token: firstToken.debugInfo ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castOrExpressionNode(node)
    let value: Any = false

    for (const param of node.params) {
      value = evaluateAstNode(param, contextStack)
      if (value) {
        break
      }
    }

    return value
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    castOrExpressionNode(node)
    return analyzeAst(node.params, contextStack, builtin)
  },
}

function castOrExpressionNode(_node: SpecialExpressionNode): asserts _node is OrSpecialExpressionNode {
  return
}
