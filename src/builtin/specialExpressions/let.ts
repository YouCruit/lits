import { joinAnalyzeResults } from '../../analyze'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, BindingNode, SpecialExpressionNode } from '../../parser/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface LetSpecialExpressionNode extends SpecialExpressionNode {
  name: `let`
  bindings: BindingNode[]
}

export const letSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseBindings, parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: LetSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `let`,
      params,
      bindings,
      token: firstToken.debugInfo ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castLetExpressionNode(node)
    const locals: Context = {}
    const newContextStack = contextStack.withContext(locals)
    for (const binding of node.bindings) {
      const bindingValueNode = binding.value
      const bindingValue = evaluateAstNode(bindingValueNode, newContextStack)
      locals[binding.name] = { value: bindingValue }
    }

    let result: Any = null
    for (const astNode of node.params) {
      result = evaluateAstNode(astNode, newContextStack)
    }
    return result
  },
  analyze: (node, contextStack, { analyzeAst }) => {
    castLetExpressionNode(node)
    const newContext = node.bindings
      .map(binding => binding.name)
      .reduce((context: Context, name) => {
        context[name] = { value: true }
        return context
      }, {})
    const bindingValueNodes = node.bindings.map(binding => binding.value)
    const bindingsResult = analyzeAst(bindingValueNodes, contextStack)
    const paramsResult = analyzeAst(node.params, contextStack.withContext(newContext))
    return joinAnalyzeResults(bindingsResult, paramsResult)
  },
}

function castLetExpressionNode(_node: SpecialExpressionNode): asserts _node is LetSpecialExpressionNode {
  return
}
