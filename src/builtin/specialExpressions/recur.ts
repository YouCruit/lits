import { RecurSignal } from '../../errors'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, GenericNode } from '../../parser/interface'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface RecurNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'recur'
  p: AstNode[]
}

export const recurSpecialExpression: BuiltinSpecialExpression<null, RecurNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    let params
    ;[position, params] = parseTokens(tokenStream, position)

    const node: RecurNode = {
      t: AstNodeType.SpecialExpression,
      n: 'recur',
      p: params,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }

    return [position + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const params = node.p.map(paramNode => evaluateAstNode(paramNode, contextStack))
    throw new RecurSignal(params)
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
