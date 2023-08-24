import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, ParseToken, SpecialExpressionNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { TokenType } from '../../constants/constants'
import { asToken, isToken } from '../../utils/tokenAsserter'
import type { BuiltinSpecialExpression } from '../interface'

export type Condition = {
  t: AstNode // test
  f: AstNode // form
}

type CondNode = SpecialExpressionNode & {
  c: Condition[]
}

function parseConditions(tokens: Token[], position: number, parseToken: ParseToken): [number, Condition[]] {
  const conditions: Condition[] = []

  let tkn = asToken(tokens[position], `EOF`)
  while (!isToken(tkn, { type: TokenType.Bracket, value: `)` })) {
    let test: AstNode
    ;[position, test] = parseToken(tokens, position)

    let form: AstNode
    ;[position, form] = parseToken(tokens, position)

    conditions.push({ t: test, f: form })

    tkn = asToken(tokens[position], `EOF`)
  }
  return [position, conditions]
}

export const condSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = asToken(tokens[position], `EOF`)
    let conditions: Condition[]
    ;[position, conditions] = parseConditions(tokens, position, parseToken)

    return [
      position + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: `cond`,
        c: conditions,
        p: [],
        tkn: firstToken.d ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    for (const condition of (node as CondNode).c) {
      const value = evaluateAstNode(condition.t, contextStack)
      if (!value) {
        continue
      }
      return evaluateAstNode(condition.f, contextStack)
    }
    return null
  },
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const astNodes = (node as CondNode).c.flatMap(condition => [condition.t, condition.f])
    return analyzeAst(astNodes, contextStack, builtin)
  },
}
