import { Any } from '../../interface'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode, nameNode, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

interface DefSpecialExpressionNode extends SpecialExpressionNode {
  name: `def`
}

export const defSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    nameNode.assert(params[0], firstToken.debugInfo)
    return [
      newPosition + 1,
      {
        type: `SpecialExpression`,
        name: `def`,
        params,
        token: firstToken.debugInfo ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    castDefExpressionNode(node)
    const debugInfo = node.token?.debugInfo
    const name = nameNode.as(node.params[0], debugInfo).value

    assertNameNotDefined(name, contextStack, builtin, debugInfo)

    const value = evaluateAstNode(astNode.as(node.params[1], debugInfo), contextStack)

    contextStack.globalContext[name] = { value }

    return value
  },
  validate: node => assertNumberOfParams(2, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    castDefExpressionNode(node)
    const debugInfo = node.token?.debugInfo
    const subNode = astNode.as(node.params[1], debugInfo)
    const result = analyzeAst(subNode, contextStack)
    const name = nameNode.as(node.params[0], debugInfo).value
    assertNameNotDefined(name, contextStack, builtin, debugInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}

function castDefExpressionNode(_node: SpecialExpressionNode): asserts _node is DefSpecialExpressionNode {
  return
}
