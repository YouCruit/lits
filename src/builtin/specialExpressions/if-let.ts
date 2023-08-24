import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, BindingNode, SpecialExpressionNode } from '../../parser/interface'
import { asValue, assertNumberOfParams } from '../../utils/assertion'
import { asAstNode } from '../../utils/astNodeAsserter'
import { valueToString } from '../../utils/debugTools'
import { asToken } from '../../utils/tokenAsserter'
import type { BuiltinSpecialExpression } from '../interface'

type IfLetNode = SpecialExpressionNode & {
  b: BindingNode
}

export const ifLetSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseBindings, parseTokens }) => {
    const firstToken = asToken(tokens[position], `EOF`)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokens, position)

    if (bindings.length !== 1) {
      throw new LitsError(`Expected exactly one binding, got ${valueToString(bindings.length)}`, firstToken.d)
    }

    let params: AstNode[]
    ;[position, params] = parseTokens(tokens, position)

    const node: IfLetNode = {
      t: AstNodeType.SpecialExpression,
      n: `if-let`,
      b: asValue(bindings[0], firstToken.d),
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const debugInfo = node.tkn?.d
    const locals: Context = {}
    const bindingValue = evaluateAstNode((node as IfLetNode).b.v, contextStack)
    if (bindingValue) {
      locals[(node as IfLetNode).b.n] = { value: bindingValue }
      const newContextStack = contextStack.withContext(locals)
      const thenForm = asAstNode(node.p[0], debugInfo)
      return evaluateAstNode(thenForm, newContextStack)
    }
    if (node.p.length === 2) {
      const elseForm = asAstNode(node.p[1], debugInfo)
      return evaluateAstNode(elseForm, contextStack)
    }
    return null
  },
  validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const newContext: Context = { [(node as IfLetNode).b.n]: { value: true } }
    const bindingResult = analyzeAst((node as IfLetNode).b.v, contextStack, builtin)
    const paramsResult = analyzeAst(node.p, contextStack.withContext(newContext), builtin)
    return joinAnalyzeResults(bindingResult, paramsResult)
  },
}
