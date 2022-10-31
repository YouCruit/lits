import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError, RecurSignal } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, BindingNode, SpecialExpressionNode } from '../../parser/interface'
import { any, asValue, token } from '../../utils/assertion'
import { valueToString } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

interface LoopSpecialExpressionNode extends SpecialExpressionNode {
  name: `loop`
  bindings: BindingNode[]
}

export const loopSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens, parseBindings }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: LoopSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `loop`,
      params,
      bindings,
      token: firstToken.debugInfo ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const debugInfo = node.token?.debugInfo
    castLoopExpressionNode(node)
    const bindingContext: Context = node.bindings.reduce((result: Context, binding) => {
      result[binding.name] = { value: evaluateAstNode(binding.value, contextStack) }
      return result
    }, {})
    const newContextStack = contextStack.withContext(bindingContext)

    for (;;) {
      let result: Any = null
      try {
        for (const form of node.params) {
          result = evaluateAstNode(form, newContextStack)
        }
      } catch (error) {
        if (error instanceof RecurSignal) {
          const params = error.params
          if (params.length !== node.bindings.length) {
            throw new LitsError(
              `recur expected ${node.bindings.length} parameters, got ${valueToString(params.length)}`,
              debugInfo,
            )
          }
          node.bindings.forEach((binding, index) => {
            asValue(bindingContext[binding.name], debugInfo).value = any.as(params[index], debugInfo)
          })
          continue
        }
        throw error
      }
      return result
    }
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    castLoopExpressionNode(node)
    const newContext = node.bindings
      .map(binding => binding.name)
      .reduce((context: Context, name) => {
        context[name] = { value: true }
        return context
      }, {})

    const bindingValueNodes = node.bindings.map(binding => binding.value)
    const bindingsResult = analyzeAst(bindingValueNodes, contextStack, builtin)
    const paramsResult = analyzeAst(node.params, contextStack.withContext(newContext), builtin)
    return joinAnalyzeResults(bindingsResult, paramsResult)
  },
}

function castLoopExpressionNode(_node: SpecialExpressionNode): asserts _node is LoopSpecialExpressionNode {
  return
}
