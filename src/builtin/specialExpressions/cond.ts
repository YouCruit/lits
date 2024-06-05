import type { Any } from '../../interface'
import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode, ParseToken } from '../../parser/interface'
import type { Token, TokenStream } from '../../tokenizer/interface'
import { asToken, isToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { SpecialExpressionNode } from '..'

export interface Condition {
  t: AstNode // test
  f: AstNode // form
}

export interface CondNode {
  t: AstNodeType.SpecialExpression
  n: 'cond'
  c: Condition[]
  p: AstNode[]
  tkn?: Token
}

function parseConditions(tokenStream: TokenStream, position: number, parseToken: ParseToken): [number, Condition[]] {
  const conditions: Condition[] = []

  let tkn = asToken(tokenStream.tokens[position], tokenStream.filePath)
  while (!isToken(tkn, { type: TokenType.Bracket, value: ')' })) {
    let test: AstNode
    ;[position, test] = parseToken(tokenStream, position)

    let form: AstNode
    ;[position, form] = parseToken(tokenStream, position)

    conditions.push({ t: test, f: form })

    tkn = asToken(tokenStream.tokens[position], tokenStream.filePath)
  }
  return [position, conditions]
}

export const condSpecialExpression: BuiltinSpecialExpression<Any, CondNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    let conditions: Condition[]
    ;[position, conditions] = parseConditions(tokenStream, position, parseToken)

    return [
      position + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'cond',
        c: conditions,
        p: [],
        tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
      } satisfies CondNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    for (const condition of node.c) {
      const value = evaluateAstNode(condition.t, contextStack)
      if (!value)
        continue

      return evaluateAstNode(condition.f, contextStack)
    }
    return null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const astNodes = node.c.flatMap(condition => [condition.t, condition.f])
    return findUnresolvedIdentifiers(astNodes, contextStack, builtin)
  },
}
