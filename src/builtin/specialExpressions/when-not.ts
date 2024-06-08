import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import { assertNumberOfParams } from '../../typeGuards'
import { assertAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { Token } from '../../tokenizer/interface'

export interface WhenNotNode {
  t: AstNodeType.SpecialExpression
  n: 'when-not'
  p: AstNode[]
  tkn?: Token
}

export const whenNotSpecialExpression: BuiltinSpecialExpression<Any, WhenNotNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    const node: WhenNotNode = {
      t: AstNodeType.SpecialExpression,
      n: 'when-not',
      p: params,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [whenExpression, ...body] = node.p
    assertAstNode(whenExpression, node.tkn?.sourceCodeInfo)

    if (evaluateAstNode(whenExpression, contextStack))
      return null

    let result: Any = null
    for (const form of body)
      result = evaluateAstNode(form, contextStack)

    return result
  },
  validate: node => assertNumberOfParams({ min: 1 }, node),
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
