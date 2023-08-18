import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError, RecurSignal } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, BindingNode, AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { any, asValue, token } from '../../utils/assertion'
import { valueToString } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

type LoopNode = SpecialExpressionNode & { bs: BindingNode[] }

export const loopSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens, parseBindings }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: LoopNode = {
      t: AstNodeType.SpecialExpression,
      n: `loop`,
      p: params,
      bs: bindings,
      tkn: firstToken.d ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const debugInfo = node.tkn?.d
    const bindingContext: Context = (node as LoopNode).bs.reduce((result: Context, binding) => {
      result[binding.n] = { value: evaluateAstNode(binding.v, contextStack) }
      return result
    }, {})
    const newContextStack = contextStack.withContext(bindingContext)

    for (;;) {
      let result: Any = null
      try {
        for (const form of node.p) {
          result = evaluateAstNode(form, newContextStack)
        }
      } catch (error) {
        if (error instanceof RecurSignal) {
          const params = error.params
          if (params.length !== (node as LoopNode).bs.length) {
            throw new LitsError(
              `recur expected ${(node as LoopNode).bs.length} parameters, got ${valueToString(params.length)}`,
              debugInfo,
            )
          }
          ;(node as LoopNode).bs.forEach((binding, index) => {
            asValue(bindingContext[binding.n], debugInfo).value = any.as(params[index], debugInfo)
          })
          continue
        }
        throw error
      }
      return result
    }
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const newContext = (node as LoopNode).bs
      .map(binding => binding.n)
      .reduce((context: Context, name) => {
        context[name] = { value: true }
        return context
      }, {})

    const bindingValueNodes = (node as LoopNode).bs.map(binding => binding.v)
    const bindingsResult = analyzeAst(bindingValueNodes, contextStack, builtin)
    const paramsResult = analyzeAst(node.p, contextStack.withContext(newContext), builtin)
    return joinAnalyzeResults(bindingsResult, paramsResult)
  },
}
