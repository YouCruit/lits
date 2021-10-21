import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { BuiltinSpecialExpression } from '../interface'

interface OrSpecialExpressionNode extends SpecialExpressionNode {
  name: `and`
}

export const orSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        type: `SpecialExpression`,
        name: `or`,
        params,
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
}

function castOrExpressionNode(_node: SpecialExpressionNode): asserts _node is OrSpecialExpressionNode {
  return
}
