import { DataType } from '../../analyze/dataTypes/DataType'
import { Any } from '../../interface'
import { assertNumberOfParams, astNode, dataType, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

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
        token: firstToken.debugInfo ? firstToken : undefined,
      },
    ]
  },

  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const debugInfo = node.token?.debugInfo

    const [conditionNode, trueNode, falseNode] = node.params
    const conditionValue = evaluateAstNode(astNode.as(conditionNode, debugInfo), contextStack)
    if ((dataType.is(conditionNode) && conditionNode.is(DataType.truthy)) || !!conditionValue) {
      return evaluateAstNode(astNode.as(trueNode, debugInfo), contextStack)
    } else if ((dataType.is(conditionNode) && conditionNode.is(DataType.falsy)) || !conditionValue) {
      if (node.params.length === 3) {
        return evaluateAstNode(astNode.as(falseNode, debugInfo), contextStack)
      } else {
        return null
      }
    } else {
      const trueBranchValue = evaluateAstNode(astNode.as(trueNode, debugInfo), contextStack)
      const falseBranchValue = evaluateAstNode(astNode.as(falseNode, debugInfo), contextStack)
      return DataType.or(DataType.of(trueBranchValue), DataType.of(falseBranchValue))
    }
  },

  validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),

  findUndefinedSymbols: (node, contextStack, { findUndefinedSymbols, builtin }) =>
    findUndefinedSymbols(node.params, contextStack, builtin),
}
