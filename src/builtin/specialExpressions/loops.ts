import type { AnalyzeAst, AnalyzeResult } from '../../analyze/interface'
import { LitsError } from '../../errors'
import type { ContextStack } from '../../evaluator/ContextStack'
import type { Context, EvaluateAstNode } from '../../evaluator/interface'
import type { Any, Arr } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, BindingNode, SpecialExpressionNode } from '../../parser/interface'
import type { Token, DebugInfo } from '../../tokenizer/interface'
import { TokenType } from '../../constants/constants'
import { asAstNode } from '../../typeGuards/astNode'
import { asToken, assertToken, isToken } from '../../typeGuards/token'
import type { Builtin, BuiltinSpecialExpression, ParserHelpers } from '../interface'
import { asAny, asColl, isSeq } from '../../typeGuards/lits'
import { asNonUndefined } from '../../typeGuards'

type LoopNode = SpecialExpressionNode & {
  l: LoopBindingNode[]
}

export type LoopBindingNode = {
  b: BindingNode // Binding
  m: Array<`&let` | `&when` | `&while`> // Modifiers
  l?: BindingNode[] // Let-Bindings
  wn?: AstNode // When Node
  we?: AstNode // While Node
}

function parseLoopBinding(
  tokens: Token[],
  position: number,
  { parseBinding, parseBindings, parseToken }: ParserHelpers,
): [number, LoopBindingNode] {
  let bindingNode: BindingNode
  ;[position, bindingNode] = parseBinding(tokens, position)

  const loopBinding: LoopBindingNode = {
    b: bindingNode,
    m: [],
  }

  let tkn = asToken(tokens[position], `EOF`)
  while (tkn.t === TokenType.Modifier) {
    switch (tkn.v) {
      case `&let`:
        if (loopBinding.l) {
          throw new LitsError(`Only one &let modifier allowed`, tkn.d)
        }
        ;[position, loopBinding.l] = parseBindings(tokens, position + 1)
        loopBinding.m.push(`&let`)
        break
      case `&when`:
        if (loopBinding.wn) {
          throw new LitsError(`Only one &when modifier allowed`, tkn.d)
        }
        ;[position, loopBinding.wn] = parseToken(tokens, position + 1)
        loopBinding.m.push(`&when`)
        break
      case `&while`:
        if (loopBinding.we) {
          throw new LitsError(`Only one &while modifier allowed`, tkn.d)
        }
        ;[position, loopBinding.we] = parseToken(tokens, position + 1)
        loopBinding.m.push(`&while`)
        break
      default:
        throw new LitsError(`Illegal modifier: ${tkn.v}`, tkn.d)
    }
    tkn = asToken(tokens[position], `EOF`)
  }
  return [position, loopBinding]
}

function addToContext(
  bindings: BindingNode[],
  context: Context,
  contextStack: ContextStack,
  evaluateAstNode: EvaluateAstNode,
  debugInfo?: DebugInfo,
) {
  for (const binding of bindings) {
    if (context[binding.n]) {
      throw new LitsError(`Variable already defined: ${binding.n}.`, debugInfo)
    }
    context[binding.n] = { value: evaluateAstNode(binding.v, contextStack) }
  }
}

function parseLoopBindings(tokens: Token[], position: number, parsers: ParserHelpers): [number, LoopBindingNode[]] {
  assertToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `[` })
  position += 1

  const loopBindings: LoopBindingNode[] = []

  let tkn = asToken(tokens[position], `EOF`)
  while (!isToken(tkn, { type: TokenType.Bracket, value: `]` })) {
    let loopBinding: LoopBindingNode
    ;[position, loopBinding] = parseLoopBinding(tokens, position, parsers)
    loopBindings.push(loopBinding)
    tkn = asToken(tokens[position], `EOF`)
  }
  return [position + 1, loopBindings]
}
function evaluateLoop(
  returnResult: boolean,
  node: SpecialExpressionNode,
  contextStack: ContextStack,
  evaluateAstNode: EvaluateAstNode,
) {
  const debugInfo = node.tkn?.d
  const { l: loopBindings, p: params } = node as LoopNode
  const expression = asAstNode(params[0], debugInfo)

  const result: Arr = []

  const bindingIndices = loopBindings.map(() => 0)
  let abort = false
  while (!abort) {
    const context: Context = {}
    const newContextStack = contextStack.withContext(context)
    let skip = false
    bindingsLoop: for (let bindingIndex = 0; bindingIndex < loopBindings.length; bindingIndex += 1) {
      const {
        b: binding,
        l: letBindings,
        wn: whenNode,
        we: whileNode,
        m: modifiers,
      } = asNonUndefined(loopBindings[bindingIndex], debugInfo)
      const coll = asColl(evaluateAstNode(binding.v, newContextStack), debugInfo)
      const seq = isSeq(coll) ? coll : Object.entries(coll)
      if (seq.length === 0) {
        skip = true
        abort = true
        break
      }
      const index = asNonUndefined(bindingIndices[bindingIndex], debugInfo)
      if (index >= seq.length) {
        skip = true
        if (bindingIndex === 0) {
          abort = true
          break
        }
        bindingIndices[bindingIndex] = 0
        bindingIndices[bindingIndex - 1] = asNonUndefined(bindingIndices[bindingIndex - 1], debugInfo) + 1
        break
      }
      if (context[binding.n]) {
        throw new LitsError(`Variable already defined: ${binding.n}.`, debugInfo)
      }
      context[binding.n] = {
        value: asAny(seq[index], debugInfo),
      }
      for (const modifier of modifiers) {
        switch (modifier) {
          case `&let`:
            addToContext(asNonUndefined(letBindings, debugInfo), context, newContextStack, evaluateAstNode, debugInfo)
            break
          case `&when`:
            if (!evaluateAstNode(asAstNode(whenNode, debugInfo), newContextStack)) {
              bindingIndices[bindingIndex] = asNonUndefined(bindingIndices[bindingIndex], debugInfo) + 1
              skip = true
              break bindingsLoop
            }
            break
          case `&while`:
            if (!evaluateAstNode(asAstNode(whileNode, debugInfo), newContextStack)) {
              bindingIndices[bindingIndex] = Number.POSITIVE_INFINITY
              skip = true
              break bindingsLoop
            }
            break
        }
      }
    }
    if (!skip) {
      const value = evaluateAstNode(expression, newContextStack)
      if (returnResult) {
        result.push(value)
      }
      bindingIndices[bindingIndices.length - 1] += 1
    }
  }
  return returnResult ? result : null
}

function analyze(
  node: SpecialExpressionNode,
  contextStack: ContextStack,
  analyzeAst: AnalyzeAst,
  builtin: Builtin,
): AnalyzeResult {
  const result: AnalyzeResult = {
    undefinedSymbols: new Set(),
  }
  const newContext: Context = {}
  const { l: loopBindings } = node as LoopNode
  loopBindings.forEach(loopBinding => {
    const { b: binding, l: letBindings, wn: whenNode, we: whileNode } = loopBinding
    analyzeAst(binding.v, contextStack.withContext(newContext), builtin).undefinedSymbols.forEach(symbol =>
      result.undefinedSymbols.add(symbol),
    )
    newContext[binding.n] = { value: true }
    if (letBindings) {
      letBindings.forEach(letBinding => {
        analyzeAst(letBinding.v, contextStack.withContext(newContext), builtin).undefinedSymbols.forEach(symbol =>
          result.undefinedSymbols.add(symbol),
        )
        newContext[letBinding.n] = { value: true }
      })
    }
    if (whenNode) {
      analyzeAst(whenNode, contextStack.withContext(newContext), builtin).undefinedSymbols.forEach(symbol =>
        result.undefinedSymbols.add(symbol),
      )
    }
    if (whileNode) {
      analyzeAst(whileNode, contextStack.withContext(newContext), builtin).undefinedSymbols.forEach(symbol =>
        result.undefinedSymbols.add(symbol),
      )
    }
  })
  analyzeAst(node.p, contextStack.withContext(newContext), builtin).undefinedSymbols.forEach(symbol =>
    result.undefinedSymbols.add(symbol),
  )
  return result
}

export const forSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens: Token[], position: number, parsers: ParserHelpers) => {
    const firstToken = asToken(tokens[position], `EOF`)
    const { parseToken } = parsers
    let loopBindings: LoopBindingNode[]
    ;[position, loopBindings] = parseLoopBindings(tokens, position, parsers)

    let expression: AstNode
    ;[position, expression] = parseToken(tokens, position)

    assertToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `)` })

    const node: LoopNode = {
      n: `for`,
      t: AstNodeType.SpecialExpression,
      l: loopBindings,
      p: [expression],
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [position + 1, node]
  },
  evaluate: (node, contextStack, helpers) => evaluateLoop(true, node, contextStack, helpers.evaluateAstNode),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyze(node, contextStack, analyzeAst, builtin),
}

export const doseqSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokens: Token[], position: number, parsers: ParserHelpers) => {
    const firstToken = asToken(tokens[position], `EOF`)
    const { parseToken } = parsers
    let loopBindings: LoopBindingNode[]
    ;[position, loopBindings] = parseLoopBindings(tokens, position, parsers)

    let expression: AstNode
    ;[position, expression] = parseToken(tokens, position)

    assertToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `)` })

    const node: LoopNode = {
      n: `doseq`,
      t: AstNodeType.SpecialExpression,
      l: loopBindings,
      p: [expression],
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [position + 1, node]
  },
  evaluate: (node, contextStack, helpers) => {
    evaluateLoop(false, node, contextStack, helpers.evaluateAstNode)
    return null
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyze(node, contextStack, analyzeAst, builtin),
}
