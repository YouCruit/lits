import { joinAnalyzeResults } from '../../analyze'
import { LitsError } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, BindingNode, SpecialExpressionNode } from '../../parser/interface'
import { toAny } from '../../utils'
import { assertNumberOfParams, asValue, sequence, token } from '../../utils/assertion'
import { valueToString } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

interface WhenFirstSpecialExpressionNode extends SpecialExpressionNode {
  name: `when-first`
  binding: BindingNode
}

export const whenFirstSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseBindings, parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    if (bindings.length !== 1) {
      throw new LitsError(`Expected exactly one binding, got ${valueToString(bindings.length)}`, firstToken.debugInfo)
    }

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: WhenFirstSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `when-first`,
      binding: asValue(bindings[0], firstToken.debugInfo),
      params,
      token: firstToken.debugInfo ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castWhenFirstExpressionNode(node)
    const locals: Context = {}
    const evaluatedBindingForm = evaluateAstNode(node.binding.value, contextStack)
    if (!sequence.is(evaluatedBindingForm)) {
      throw new LitsError(
        `Expected undefined or a sequence, got ${valueToString(evaluatedBindingForm)}`,
        node.token?.debugInfo,
      )
    }

    if (evaluatedBindingForm.length === 0) {
      return null
    }

    const bindingValue = toAny(evaluatedBindingForm[0])
    locals[node.binding.name] = { value: bindingValue }
    const newContextStack = contextStack.withContext(locals)

    let result: Any = null
    for (const form of node.params) {
      result = evaluateAstNode(form, newContextStack)
    }
    return result
  },
  validate: node => assertNumberOfParams({ min: 0 }, node),
  analyze: (node, contextStack, { analyzeAst }) => {
    castWhenFirstExpressionNode(node)
    const newContext: Context = { [node.binding.name]: { value: true } }
    const bindingResult = analyzeAst(node.binding.value, contextStack)
    const paramsResult = analyzeAst(node.params, contextStack.withContext(newContext))
    return joinAnalyzeResults(bindingResult, paramsResult)
  },
}

function castWhenFirstExpressionNode(_node: SpecialExpressionNode): asserts _node is WhenFirstSpecialExpressionNode {
  return
}
