import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNodeType } from '../../parser/AstNodeType'
import { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenizerType } from '../../tokenizer/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const doSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    let tkn = token.as(tokens[position], `EOF`)

    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `do`,
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
