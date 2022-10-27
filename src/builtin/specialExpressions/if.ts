import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface IfSpecialExpressionNode extends SpecialExpressionNode {
  name: `if`
}

export const ifSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        type: `SpecialExpression`,
        name: `if`,
        params,
        token: firstToken,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castIfExpressionNode(node)
    const debugInfo = node.token.debugInfo

    const [conditionNode, trueNode, falseNode] = node.params
    if (evaluateAstNode(astNode.as(conditionNode, debugInfo), contextStack)) {
      return evaluateAstNode(astNode.as(trueNode, debugInfo), contextStack)
    } else {
      if (node.params.length === 3) {
        return evaluateAstNode(astNode.as(falseNode, debugInfo), contextStack)
      } else {
        return null
      }
    }
  },
  validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  analyze: (node, contextStack, { analyzeAst }) => {
    castIfExpressionNode(node)
    return analyzeAst(node.params, contextStack)
  },
}

function castIfExpressionNode(_node: SpecialExpressionNode): asserts _node is IfSpecialExpressionNode {
  return
}
