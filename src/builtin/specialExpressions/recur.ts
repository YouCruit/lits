import { RecurSignal } from '../../errors'
import { AstNodeType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { Token } from '../../tokenizer/interface'

export interface RecurNode {
  t: AstNodeType.SpecialExpression
  n: 'recur'
  p: AstNode[]
  tkn?: Token
}

export const recurSpecialExpression: BuiltinSpecialExpression<null, RecurNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    let params
    ;[position, params] = parseTokens(tokenStream, position)

    const node: RecurNode = {
      t: AstNodeType.SpecialExpression,
      n: 'recur',
      p: params,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }

    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const params = node.p.map(paramNode => evaluateAstNode(paramNode, contextStack))
    throw new RecurSignal(params)
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
