import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode, string, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

interface DefsSpecialExpressionNode extends SpecialExpressionNode {
  name: `defs`
}

export const defsSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        type: `SpecialExpression`,
        name: `defs`,
        params,
        token: firstToken,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    castDefsExpressionNode(node)
    const debugInfo = node.token.debugInfo
    const name = evaluateAstNode(astNode.as(node.params[0], debugInfo), contextStack)
    string.assert(name, debugInfo)

    assertNameNotDefined(name, contextStack, builtin, node.token.debugInfo)

    const value = evaluateAstNode(astNode.as(node.params[1], debugInfo), contextStack)

    contextStack.globalContext[name] = { value }

    return value
  },
  validate: node => assertNumberOfParams(2, node),
  analyze: (node, contextStack, { analyzeAst }) => {
    castDefsExpressionNode(node)
    const subNode = astNode.as(node.params[1], node.token.debugInfo)
    return analyzeAst(subNode, contextStack)
  },
}

function castDefsExpressionNode(_node: SpecialExpressionNode): asserts _node is DefsSpecialExpressionNode {
  return
}
