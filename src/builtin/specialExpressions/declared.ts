import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, token, nameNode } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface DeclaredSpecialExpressionNode extends SpecialExpressionNode {
  name: `declared?`
}

export const declaredSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: DeclaredSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `declared?`,
      params,
      token: firstToken,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { lookUp }) => {
    castDeclaredExpressionNode(node)

    const [astNode] = node.params
    nameNode.assert(astNode, node.token.debugInfo)

    const lookUpResult = lookUp(astNode, contextStack)
    return !!(lookUpResult.builtinFunction || lookUpResult.contextEntry || lookUpResult.specialExpression)
  },
  validate: node => assertNumberOfParams(1, node),
}

function castDeclaredExpressionNode(_node: SpecialExpressionNode): asserts _node is DeclaredSpecialExpressionNode {
  return
}
