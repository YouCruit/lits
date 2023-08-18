import { joinAnalyzeResults } from '../../analyze/utils'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, BindingNode, AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

type LetNode = SpecialExpressionNode & {
  bs: BindingNode[]
}

export const letSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseBindings, parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: LetNode = {
      t: AstNodeType.SpecialExpression,
      n: `let`,
      p: params,
      bs: bindings,
      tkn: firstToken.d ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const locals: Context = {}
    const newContextStack = contextStack.withContext(locals)
    for (const binding of (node as LetNode).bs) {
      const bindingValueNode = binding.v
      const bindingValue = evaluateAstNode(bindingValueNode, newContextStack)
      locals[binding.n] = { value: bindingValue }
    }

    let result: Any = null
    for (const astNode of node.p) {
      result = evaluateAstNode(astNode, newContextStack)
    }
    return result
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const newContext = (node as LetNode).bs
      .map(binding => binding.n)
      .reduce((context: Context, name) => {
        context[name] = { value: true }
        return context
      }, {})
    const bindingContext: Context = {}
    const bindingResults = (node as LetNode).bs.map(bindingNode => {
      const valueNode = bindingNode.v
      const bindingsResult = analyzeAst(valueNode, contextStack.withContext(bindingContext), builtin)
      bindingContext[bindingNode.n] = { value: true }
      return bindingsResult
    })

    const paramsResult = analyzeAst(node.p, contextStack.withContext(newContext), builtin)
    return joinAnalyzeResults(...bindingResults, paramsResult)
  },
}
