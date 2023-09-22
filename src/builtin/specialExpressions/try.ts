import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, NameNode, SpecialExpressionNode } from '../../parser/interface'
import { TokenType } from '../../constants/constants'
import { assertNameNode } from '../../typeGuards/astNode'
import { asToken, assertToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { asAny } from '../../typeGuards/lits'
import { getDebugInfo } from '../../utils/debug/getDebugInfo'

type TryNode = SpecialExpressionNode & {
  te: AstNode
  e: NameNode
  ce: AstNode
}

export const trySpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = asToken(tokens[position], `EOF`)
    let tryExpression: AstNode
    ;[position, tryExpression] = parseToken(tokens, position)

    assertToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `(` })
    position += 1

    let catchNode: AstNode
    ;[position, catchNode] = parseToken(tokens, position)
    assertNameNode(catchNode, catchNode.tkn?.d)
    if (catchNode.v !== `catch`) {
      throw new LitsError(`Expected 'catch', got '${catchNode.v}'.`, getDebugInfo(catchNode, catchNode.tkn?.d))
    }

    let error: AstNode
    ;[position, error] = parseToken(tokens, position)
    assertNameNode(error, error.tkn?.d)

    let catchExpression: AstNode
    ;[position, catchExpression] = parseToken(tokens, position)

    assertToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `)` })
    position += 1

    assertToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `)` })
    position += 1

    const node: TryNode = {
      t: AstNodeType.SpecialExpression,
      n: `try`,
      p: [],
      te: tryExpression,
      ce: catchExpression,
      e: error,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const { te: tryExpression, ce: catchExpression, e: errorNode } = node as TryNode
    try {
      return evaluateAstNode(tryExpression, contextStack)
    } catch (error) {
      const newContext: Context = {
        [errorNode.v]: { value: asAny(error, node.tkn?.d) },
      }
      return evaluateAstNode(catchExpression, contextStack.create(newContext))
    }
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const { te: tryExpression, ce: catchExpression, e: errorNode } = node as TryNode
    const tryResult = analyzeAst(tryExpression, contextStack, builtin)
    const newContext: Context = {
      [errorNode.v]: { value: true },
    }
    const catchResult = analyzeAst(catchExpression, contextStack.create(newContext), builtin)
    return joinAnalyzeResults(tryResult, catchResult)
  },
}
