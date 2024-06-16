import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError, RecurSignal } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, BindingNode, GenericNode } from '../../parser/interface'
import { valueToString } from '../../utils/debug/debugTools'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { asNonUndefined } from '../../typeGuards'
import { asAny } from '../../typeGuards/lits'

export interface LoopNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'loop'
  p: AstNode[]
  bs: BindingNode[]
}

export const loopSpecialExpression: BuiltinSpecialExpression<Any, LoopNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens, parseBindings }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokenStream, position)

    let params: AstNode[]
    ;[position, params] = parseTokens(tokenStream, position)

    const node: LoopNode = {
      t: AstNodeType.SpecialExpression,
      n: 'loop',
      p: params,
      bs: bindings,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const sourceCodeInfo = node.debug?.token.sourceCodeInfo
    const bindingContext: Context = node.bs.reduce((result: Context, binding) => {
      result[binding.n] = { value: evaluateAstNode(binding.v, contextStack) }
      return result
    }, {})
    const newContextStack = contextStack.create(bindingContext)

    for (;;) {
      let result: Any = null
      try {
        for (const form of node.p)
          result = evaluateAstNode(form, newContextStack)
      }
      catch (error) {
        if (error instanceof RecurSignal) {
          const params = error.params
          if (params.length !== node.bs.length) {
            throw new LitsError(
              `recur expected ${node.bs.length} parameters, got ${valueToString(params.length)}`,
              sourceCodeInfo,
            )
          }
          ;node.bs.forEach((binding, index) => {
            asNonUndefined(bindingContext[binding.n], sourceCodeInfo).value = asAny(params[index], sourceCodeInfo)
          })
          continue
        }
        throw error
      }
      return result
    }
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const newContext = node.bs
      .map(binding => binding.n)
      .reduce((context: Context, name) => {
        context[name] = { value: true }
        return context
      }, {})

    const bindingValueNodes = node.bs.map(binding => binding.v)
    const bindingsResult = findUnresolvedIdentifiers(bindingValueNodes, contextStack, builtin)
    const paramsResult = findUnresolvedIdentifiers(node.p, contextStack.create(newContext), builtin)
    return joinAnalyzeResults(bindingsResult, paramsResult)
  },
}
