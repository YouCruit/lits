import { joinAnalyzeResults } from '../../analyze/utils'
import { AstNodeType } from '../../constants/constants'
import { LitsError } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import type { AstNode, BindingNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { asNonUndefined, assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { asAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import { valueToString } from '../../utils/debug/debugTools'
import type { BuiltinSpecialExpression } from '../interface'

export interface IfLetNode {
  t: AstNodeType.SpecialExpression
  n: 'if-let'
  p: AstNode[]
  b: BindingNode
  tkn?: Token
}

export const ifLetSpecialExpression: BuiltinSpecialExpression<Any, IfLetNode> = {
  parse: (tokenStream, position, { parseBindings, parseTokensUntilClosingBracket: parseTokens }) => {
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
    assertNumberOfParamsFromAstNodes({
      name: 'if-let',
      count: { min: 1, max: 2 },
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })
    const node: IfLetNode = {
      t: AstNodeType.SpecialExpression,
      n: 'if-let',
      b: asNonUndefined(bindings[0], firstToken.sourceCodeInfo),
      p: params,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }
    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const locals: Context = {}
    const bindingValue = evaluateAstNode(node.b.v, contextStack)
    if (bindingValue) {
      locals[node.b.n] = { value: bindingValue }
      const newContextStack = contextStack.create(locals)
      const thenForm = asAstNode(node.p[0], sourceCodeInfo)
      return evaluateAstNode(thenForm, newContextStack)
    }
    if (node.p.length === 2) {
      const elseForm = asAstNode(node.p[1], sourceCodeInfo)
      return evaluateAstNode(elseForm, contextStack)
    }
    return null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const newContext: Context = { [node.b.n]: { value: true } }
    const bindingResult = findUnresolvedIdentifiers([node.b.v], contextStack, builtin)
    const paramsResult = findUnresolvedIdentifiers(node.p, contextStack.create(newContext), builtin)
    return joinAnalyzeResults(bindingResult, paramsResult)
  },
}
