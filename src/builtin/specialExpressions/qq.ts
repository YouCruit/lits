import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import { isNameNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertAny } from '../../typeGuards/lits'
import { assertNumberOfParams } from '../../typeGuards'
import type { Token } from '../../tokenizer/interface'
import type { SpecialExpressionNode } from '..'

export interface QqNode {
  t: AstNodeType.SpecialExpression
  n: '??'
  p: AstNode[]
  tkn?: Token
}

export const qqSpecialExpression: BuiltinSpecialExpression<Any, QqNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    const node: QqNode = {
      t: AstNodeType.SpecialExpression,
      n: '??',
      p: params,
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [firstNode, secondNode] = node.p

    if (isNameNode(firstNode)) {
      if (contextStack.lookUp(firstNode) === null)
        return secondNode ? evaluateAstNode(secondNode, contextStack) : null
    }
    assertAny(firstNode, node.tkn?.sourceCodeInfo)
    const firstResult = evaluateAstNode(firstNode, contextStack)
    return firstResult ?? (secondNode ? evaluateAstNode(secondNode, contextStack) : null)
  },
  validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
