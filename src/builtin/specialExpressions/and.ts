import { DataType } from '../../analyze/dataTypes/DataType'
import { Any } from '../../interface'
import { asValue, dataType, token } from '../../utils/assertion'
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
    const possibleValues: Any[] = []
    let value: Any = true

    for (const param of node.params) {
      value = evaluateAstNode(param, contextStack)
      if ((dataType.is(value) && value.is(DataType.falsy)) || !value) {
        break
      } else if (dataType.is(value)) {
        possibleValues.push(value)
      }
    }

    if (possibleValues.length === 0) {
      return value
    } else if (possibleValues.length === 1) {
      return asValue(possibleValues[0])
    } else {
      return DataType.or(...possibleValues.map(DataType.of))
    }
  },

  validate: () => undefined,

  findUndefinedSymbols: (node, contextStack, { findUndefinedSymbols, builtin }) =>
    findUndefinedSymbols(node.params, contextStack, builtin),
}
