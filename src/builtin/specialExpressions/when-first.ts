import { joinAnalyzeResults } from '../../analyze/utils'
import { AstNodeType } from '../../constants/constants'
import { LitsError } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import type { AstNode, BindingNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { asNonUndefined } from '../../typeGuards'
import { isSeq } from '../../typeGuards/lits'
import { asToken } from '../../typeGuards/token'
import { toAny } from '../../utils'
import { valueToString } from '../../utils/debug/debugTools'
import type { BuiltinSpecialExpression } from '../interface'

export interface WhenFirstNode {
  t: AstNodeType.SpecialExpression
  n: 'when-first'
  p: AstNode[]
  b: BindingNode
  tkn?: Token
}

export const whenFirstSpecialExpression: BuiltinSpecialExpression<Any, WhenFirstNode> = {
  parse: (tokenStream, position, { parseBindings, parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    let bindings: BindingNode[]
    ;[position, bindings] = parseBindings(tokenStream, position)

    if (bindings.length !== 1) {
      throw new LitsError(
        `Expected exactly one binding, got ${valueToString(bindings.length)}`,
        firstToken.sourceCodeInfo,
      )
    }

    let params: AstNode[]
    ;[position, params] = parseTokens(tokenStream, position)

    const node: WhenFirstNode = {
      t: AstNodeType.SpecialExpression,
      n: 'when-first',
      b: asNonUndefined(bindings[0], firstToken.sourceCodeInfo),
      p: params,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const locals: Context = {}
    const { b: binding } = node
    const evaluatedBindingForm = evaluateAstNode(binding.v, contextStack)
    if (!isSeq(evaluatedBindingForm)) {
      throw new LitsError(
        `Expected undefined or a sequence, got ${valueToString(evaluatedBindingForm)}`,
        node.tkn?.sourceCodeInfo,
      )
    }

    if (evaluatedBindingForm.length === 0)
      return null

    const bindingValue = toAny(evaluatedBindingForm[0])
    locals[binding.n] = { value: bindingValue }
    const newContextStack = contextStack.create(locals)

    let result: Any = null
    for (const form of node.p)
      result = evaluateAstNode(form, newContextStack)

    return result
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const { b: binding } = node
    const newContext: Context = { [binding.n]: { value: true } }
    const bindingResult = findUnresolvedIdentifiers([binding.v], contextStack, builtin)
    const paramsResult = findUnresolvedIdentifiers(node.p, contextStack.create(newContext), builtin)
    return joinAnalyzeResults(bindingResult, paramsResult)
  },
}
