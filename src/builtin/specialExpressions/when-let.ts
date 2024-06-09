import { joinAnalyzeResults } from '../../analyze/utils'
import { AstNodeType } from '../../constants/constants'
import { LitsError } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import type { AstNode, BindingNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { asNonUndefined } from '../../typeGuards'
import { asToken } from '../../typeGuards/token'
import { valueToString } from '../../utils/debug/debugTools'
import type { BuiltinSpecialExpression } from '../interface'

export interface WhenLetNode {
  t: AstNodeType.SpecialExpression
  n: 'when-let'
  p: AstNode[]
  b: BindingNode
  tkn?: Token
}

export const whenLetSpecialExpression: BuiltinSpecialExpression<Any, WhenLetNode> = {
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

    const node: WhenLetNode = {
      t: AstNodeType.SpecialExpression,
      n: 'when-let',
      b: asNonUndefined(bindings[0], firstToken.sourceCodeInfo),
      p: params,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const { b: binding } = node
    const locals: Context = {}
    const bindingValue = evaluateAstNode(binding.v, contextStack)
    if (!bindingValue)
      return null

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
