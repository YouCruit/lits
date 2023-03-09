import { DataType } from '../../analyze/dataTypes/DataType'
import { Any } from '../../interface'
import { assertNumberOfParams, astNode, asValue, token } from '../../utils/assertion'
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

  findUndefinedSymbols: (node, contextStack, { findUndefinedSymbols, builtin }) =>
    findUndefinedSymbols(node.params, contextStack, builtin),

  getDataType(node, contextStack, { getDataType: dataType }) {
    const conditionType = dataType(asValue(node.params[0]), contextStack)
    const truthyBranchType = dataType(asValue(node.params[1]), contextStack)
    const falsyBranchType = dataType(asValue(node.params[2]), contextStack)

    if (conditionType.is(DataType.truthy)) {
      return truthyBranchType
    } else if (conditionType.is(DataType.falsy)) {
      return falsyBranchType
    } else {
      return DataType.or(truthyBranchType, falsyBranchType)
    }
  },
}
