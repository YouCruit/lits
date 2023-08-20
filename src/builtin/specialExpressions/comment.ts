import { AstNodeType } from '../../parser/AstNodeType'
import { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenizerType } from '../../tokenizer/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const commentSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokens, position, { parseToken }) => {
    let tkn = token.as(tokens[position], `EOF`)

    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `comment`,
      p: [],
      tkn: tkn.d ? tkn : undefined,
    }

    while (!token.is(tkn, { type: TokenizerType.Bracket, value: `)` })) {
      let bodyNode: AstNode
      ;[position, bodyNode] = parseToken(tokens, position)
      node.p.push(bodyNode)
      tkn = token.as(tokens[position], `EOF`)
    }
    return [position + 1, node]
  },
  evaluate: () => null,
  analyze: () => ({ undefinedSymbols: new Set() }),
}
