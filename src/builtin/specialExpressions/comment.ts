import { AstNodeType } from '../../constants/constants'
import type { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenType } from '../../constants/constants'
import { asToken, isToken } from '../../utils/tokenAsserter'
import type { BuiltinSpecialExpression } from '../interface'

export const commentSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokens, position, { parseToken }) => {
    let tkn = asToken(tokens[position], `EOF`)

    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `comment`,
      p: [],
      tkn: tkn.d ? tkn : undefined,
    }

    while (!isToken(tkn, { type: TokenType.Bracket, value: `)` })) {
      let bodyNode: AstNode
      ;[position, bodyNode] = parseToken(tokens, position)
      node.p.push(bodyNode)
      tkn = asToken(tokens[position], `EOF`)
    }
    return [position + 1, node]
  },
  evaluate: () => null,
  analyze: () => ({ undefinedSymbols: new Set() }),
}
