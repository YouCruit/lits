import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenType } from '../../constants/constants'
import { asToken, isToken } from '../../utils/tokenAsserter'
import type { BuiltinSpecialExpression } from '../interface'

export const doSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    let tkn = asToken(tokens[position], `EOF`)

    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `do`,
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
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const newContext: Context = {}

    const newContextStack = contextStack.withContext(newContext)
    let result: Any = null
    for (const form of node.p) {
      result = evaluateAstNode(form, newContextStack)
    }
    return result
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
