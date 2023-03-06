import { DataType } from '../../analyze/dataTypes/DataType'
import { Any } from '../../interface'
import { asValue, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

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
    let value: Any = false

    for (const param of node.params) {
      value = evaluateAstNode(param, contextStack)
      if (value) {
        break
      }
    }

    return value
  },

  validate: () => undefined,

  findUndefinedSymbols: (node, contextStack, { findUndefinedSymbols, builtin }) =>
    findUndefinedSymbols(node.params, contextStack, builtin),

  dataType(node, contextStack, helpers) {
    if (node.params.length === 0) {
      return DataType.false
    }
    const params = node.params.map(p => helpers.dataType(p, contextStack))
    for (const param of params) {
      if (param.is(DataType.truthy)) {
        return param
      }
    }
    return asValue(params[params.length - 1])
  },
}
