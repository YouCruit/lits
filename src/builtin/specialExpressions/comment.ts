import { AstNodeType, TokenType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { asToken, isToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface CommentNode {
  t: AstNodeType.SpecialExpression
  n: 'comment'
  p: AstNode[]
  tkn?: Token
}

export const commentSpecialExpression: BuiltinSpecialExpression<null, CommentNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    let tkn = asToken(tokenStream.tokens[position], tokenStream.filePath)

    const node: CommentNode = {
      t: AstNodeType.SpecialExpression,
      n: 'comment',
      p: [],
      tkn: tkn.sourceCodeInfo ? tkn : undefined,
    } satisfies CommentNode

    while (!isToken(tkn, { type: TokenType.Bracket, value: ')' })) {
      let bodyNode: AstNode
      ;[position, bodyNode] = parseToken(tokenStream, position)
      node.p.push(bodyNode)
      tkn = asToken(tokenStream.tokens[position], tokenStream.filePath)
    }
    return [position + 1, node]
  },
  evaluate: () => null,
  findUnresolvedIdentifiers: () => new Set(),
}
