import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNodeType } from '../../parser/AstNodeType'
import { AstNode, BindingNode, SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode, asValue, token } from '../../utils/assertion'
import { valueToString } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

type IfLetNode = SpecialExpressionNode & {
  b: BindingNode
}

export const ifLetSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseBindings, parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
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
      const thenForm = astNode.as(node.p[0], debugInfo)
      return evaluateAstNode(thenForm, newContextStack)
    }
    if (node.p.length === 2) {
      const elseForm = astNode.as(node.p[1], debugInfo)
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
