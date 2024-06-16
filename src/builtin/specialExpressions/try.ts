import { joinAnalyzeResults } from '../../analyze/utils'
import { LitsError } from '../../errors'
import type { Context } from '../../evaluator/interface'
import type { Any } from '../../interface'
import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode, GenericNode, NameNode } from '../../parser/interface'
import { assertNameNode } from '../../typeGuards/astNode'
import { asToken, assertToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { asAny } from '../../typeGuards/lits'
import { getSourceCodeInfo } from '../../utils/debug/getSourceCodeInfo'

export interface TryNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'try'
  te: AstNode
  e: NameNode
  ce: AstNode
}

export const trySpecialExpression: BuiltinSpecialExpression<Any, TryNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    let tryExpression: AstNode
    ;[position, tryExpression] = parseToken(tokenStream, position)

    assertToken(tokenStream.tokens[position], tokenStream.filePath, { type: TokenType.Bracket, value: '(' })
    position += 1

    let catchNode: AstNode
    ;[position, catchNode] = parseToken(tokenStream, position)
    assertNameNode(catchNode, catchNode.debug?.token.sourceCodeInfo)
    if (catchNode.v !== 'catch') {
      throw new LitsError(
        `Expected 'catch', got '${catchNode.v}'.`,
        getSourceCodeInfo(catchNode, catchNode.debug?.token.sourceCodeInfo),
      )
    }

    let error: AstNode
    ;[position, error] = parseToken(tokenStream, position)
    assertNameNode(error, error.debug?.token.sourceCodeInfo)

    let catchExpression: AstNode
    ;[position, catchExpression] = parseToken(tokenStream, position)

    assertToken(tokenStream.tokens[position], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })
    position += 1

    assertToken(tokenStream.tokens[position], tokenStream.filePath, { type: TokenType.Bracket, value: ')' })
    position += 1

    const node: TryNode = {
      t: AstNodeType.SpecialExpression,
      n: 'try',
      te: tryExpression,
      ce: catchExpression,
      e: error,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }

    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const { te: tryExpression, ce: catchExpression, e: errorNode } = node
    try {
      return evaluateAstNode(tryExpression, contextStack)
    }
    catch (error) {
      const newContext: Context = {
        [errorNode.v]: { value: asAny(error, node.debug?.token.sourceCodeInfo) },
      }
      return evaluateAstNode(catchExpression, contextStack.create(newContext))
    }
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const { te: tryExpression, ce: catchExpression, e: errorNode } = node
    const tryResult = findUnresolvedIdentifiers([tryExpression], contextStack, builtin)
    const newContext: Context = {
      [errorNode.v]: { value: true },
    }
    const catchResult = findUnresolvedIdentifiers([catchExpression], contextStack.create(newContext), builtin)
    return joinAnalyzeResults(tryResult, catchResult)
  },
}
