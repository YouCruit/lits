import { DataType } from '../../analyze/dataTypes/DataType'
import { Any } from '../../interface'
import { asValue, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const andSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        type: `SpecialExpression`,
        name: `and`,
        params,
        token: firstToken.debugInfo ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    let value: Any = true

    for (const param of node.params) {
      value = evaluateAstNode(param, contextStack)
      if (!value) {
        break
      }
    }

    return value
  },

  validate: () => undefined,

  findUndefinedSymbols: (node, contextStack, { findUndefinedSymbols, builtin }) =>
    findUndefinedSymbols(node.params, contextStack, builtin),

  getDataType(node, contextStack, helpers) {
    if (node.params.length === 0) {
      return DataType.true
    }
    const params = node.params.map(p => helpers.getDataType(p, contextStack))
    for (const param of params) {
      if (param.is(DataType.falsy)) {
        return param
      }
    }
    return asValue(params[params.length - 1])
  },
}
