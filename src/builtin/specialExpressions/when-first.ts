import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, BindingNode, AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { toAny } from '../../utils'
import { assertNumberOfParams, asValue, sequence, token } from '../../utils/assertion'
import { valueToString } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

type WhenFirstNode = SpecialExpressionNode & {
  b: BindingNode
}

export const whenFirstSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseBindings, parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    if (bindings.length !== 1) {
      throw new LitsError(`Expected exactly one binding, got ${valueToString(bindings.length)}`, firstToken.d)
    }

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: WhenFirstNode = {
      t: AstNodeType.SpecialExpression,
      n: `when-first`,
      b: asValue(bindings[0], firstToken.d),
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const locals: Context = {}
    const { b: binding } = node as WhenFirstNode
    const evaluatedBindingForm = evaluateAstNode(binding.v, contextStack)
    if (!sequence.is(evaluatedBindingForm)) {
      throw new LitsError(`Expected undefined or a sequence, got ${valueToString(evaluatedBindingForm)}`, node.tkn?.d)
    }

    if (evaluatedBindingForm.length === 0) {
      return null
    }

    const bindingValue = toAny(evaluatedBindingForm[0])
    locals[binding.n] = { value: bindingValue }
    const newContextStack = contextStack.withContext(locals)

    let result: Any = null
    for (const form of node.p) {
      result = evaluateAstNode(form, newContextStack)
    }
    return result
  },
  validate: node => assertNumberOfParams({ min: 0 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const { b: binding } = node as WhenFirstNode
    const newContext: Context = { [binding.n]: { value: true } }
    const bindingResult = analyzeAst(binding.v, contextStack, builtin)
    const paramsResult = analyzeAst(node.p, contextStack.withContext(newContext), builtin)
    return joinAnalyzeResults(bindingResult, paramsResult)
  },
}
