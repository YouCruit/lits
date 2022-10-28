import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface DoSpecialExpressionNode extends SpecialExpressionNode {
  name: `do`
}

export const doSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    let tkn = token.as(tokens[position], `EOF`)

    const node: DoSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `do`,
      params: [],
      token: tkn.debugInfo ? tkn : undefined,
    }

    while (!token.is(tkn, { type: `paren`, value: `)` })) {
      let bodyNode: AstNode
      ;[position, bodyNode] = parseToken(tokens, position)
      node.params.push(bodyNode)
      tkn = token.as(tokens[position], `EOF`)
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castDoExpressionNode(node)
    const newContext: Context = {}

    const newContextStack = contextStack.withContext(newContext)
    let result: Any = null
    for (const form of node.params) {
      result = evaluateAstNode(form, newContextStack)
    }
    return result
  },
  analyze: (node, contextStack, { analyzeAst }) => {
    castDoExpressionNode(node)
    return analyzeAst(node.params, contextStack)
  },
}

function castDoExpressionNode(_node: SpecialExpressionNode): asserts _node is DoSpecialExpressionNode {
  return
}
