import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, NameNode, AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { TokenizerType } from '../../tokenizer/interface'
import { any, nameNode, token } from '../../utils/assertion'
import { getDebugInfo } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

type TryNode = SpecialExpressionNode & {
  te: AstNode
  e: NameNode
  ce: AstNode
}

export const trySpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let tryExpression: AstNode
    ;[position, tryExpression] = parseToken(tokens, position)

    token.assert(tokens[position], `EOF`, { type: TokenizerType.Bracket, value: `(` })
    position += 1

    let catchNode: AstNode
    ;[position, catchNode] = parseToken(tokens, position)
    nameNode.assert(catchNode, catchNode.tkn?.d)
    if (catchNode.v !== `catch`) {
      throw new LitsError(`Expected 'catch', got '${catchNode.v}'.`, getDebugInfo(catchNode, catchNode.tkn?.d))
    }

    let error: AstNode
    ;[position, error] = parseToken(tokens, position)
    nameNode.assert(error, error.tkn?.d)

    let catchExpression: AstNode
    ;[position, catchExpression] = parseToken(tokens, position)

    token.assert(tokens[position], `EOF`, { type: TokenizerType.Bracket, value: `)` })
    position += 1

    token.assert(tokens[position], `EOF`, { type: TokenizerType.Bracket, value: `)` })
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
        [errorNode.v]: { value: any.as(error, node.tkn?.d) },
      } as Context
      return evaluateAstNode(catchExpression, contextStack.withContext(newContext))
    }
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const { te: tryExpression, ce: catchExpression, e: errorNode } = node as TryNode
    const tryResult = analyzeAst(tryExpression, contextStack, builtin)
    const newContext: Context = {
      [errorNode.v]: { value: true },
    }
    const catchResult = analyzeAst(catchExpression, contextStack.withContext(newContext), builtin)
    return joinAnalyzeResults(tryResult, catchResult)
  },
}
