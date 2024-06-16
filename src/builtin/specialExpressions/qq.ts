import { AstNodeType } from '../../constants/constants'
import type { Any } from '../../interface'
import type { AstNode, GenericNode } from '../../parser/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { isNameNode } from '../../typeGuards/astNode'
import { assertAny } from '../../typeGuards/lits'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface QqNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: '??'
  p: [AstNode] | [AstNode, AstNode]
}

export const qqSpecialExpression: BuiltinSpecialExpression<Any, QqNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    assertNumberOfParamsFromAstNodes({
      name: '??',
      count: { min: 1, max: 2 },
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })
    const node: QqNode = {
      t: AstNodeType.SpecialExpression,
      n: '??',
      p: params.length === 1 ? [params[0]!] : [params[0]!, params[1]!],
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [firstNode, secondNode] = node.p

    if (isNameNode(firstNode)) {
      if (contextStack.lookUp(firstNode) === null)
        return secondNode ? evaluateAstNode(secondNode, contextStack) : null
    }
    assertAny(firstNode, node.debug?.token.sourceCodeInfo)
    const firstResult = evaluateAstNode(firstNode, contextStack)
    return firstResult ?? (secondNode ? evaluateAstNode(secondNode, contextStack) : null)
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
