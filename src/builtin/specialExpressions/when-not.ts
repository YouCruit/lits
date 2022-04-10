import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface WhenNotSpecialExpressionNode extends SpecialExpressionNode {
  name: `when-not`
}

export const whenNotSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: WhenNotSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `when-not`,
      params,
      token: firstToken,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castWhenNotExpressionNode(node)

    const [whenExpression, ...body] = node.params
    astNode.assert(whenExpression, node.token.debugInfo)

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
}

function castWhenNotExpressionNode(_node: SpecialExpressionNode): asserts _node is WhenNotSpecialExpressionNode {
  return
}
