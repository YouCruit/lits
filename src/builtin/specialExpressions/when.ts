import { AstNodeType } from '../../constants/constants'
import type { Any } from '../../interface'
import type { AstNode, GenericNode } from '../../parser/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { assertAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface WhenNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'when'
  p: AstNode[]
}

export const whenSpecialExpression: BuiltinSpecialExpression<Any, WhenNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    assertNumberOfParamsFromAstNodes({
      name: 'when',
      count: { min: 1 },
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })
    const node: WhenNode = {
      t: AstNodeType.SpecialExpression,
      n: 'when',
      p: params,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [whenExpression, ...body] = node.p
    assertAstNode(whenExpression, node.debug?.token.sourceCodeInfo)

    if (!evaluateAstNode(whenExpression, contextStack))
      return null

    let result: Any = null
    for (const form of body)
      result = evaluateAstNode(form, contextStack)

    return result
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
