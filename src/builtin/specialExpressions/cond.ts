import { Any } from '../../interface'
import { AstNodeType } from '../../parser/AstNodeType'
import { AstNode, ParseToken, SpecialExpressionNode } from '../../parser/interface'
import { Token, TokenizerType } from '../../tokenizer/interface'
import { token } from '../../utils/tokenAssertion'
import { BuiltinSpecialExpression } from '../interface'

export type Condition = {
  t: AstNode // test
  f: AstNode // form
}

type CondNode = SpecialExpressionNode & {
  c: Condition[]
}

function parseConditions(tokens: Token[], position: number, parseToken: ParseToken): [number, Condition[]] {
  const conditions: Condition[] = []

  let tkn = token.as(tokens[position], `EOF`)
  while (!token.is(tkn, { type: TokenizerType.Bracket, value: `)` })) {
    let test: AstNode
    ;[position, test] = parseToken(tokens, position)

    let form: AstNode
    ;[position, form] = parseToken(tokens, position)

    conditions.push({ t: test, f: form })

    tkn = token.as(tokens[position], `EOF`)
  }
  return [position, conditions]
}

export const condSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = token.as(tokens[position], `EOF`)
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
