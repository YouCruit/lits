import { Any } from '../../interface'
import { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface CommentSpecialExpressionNode extends SpecialExpressionNode {
  name: `comment`
}

export const commentSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    let tkn = token.as(tokens[position], `EOF`)

    const node: CommentSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `comment`,
      params: [],
      token: tkn,
    }

    while (!token.is(tkn, { type: `paren`, value: `)` })) {
      let bodyNode: AstNode
      ;[position, bodyNode] = parseToken(tokens, position)
      node.params.push(bodyNode)
      tkn = token.as(tokens[position], `EOF`)
    }
    return [position + 1, node]
  },
  evaluate: () => null,
}
