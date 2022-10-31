import { UserDefinedError } from '../../errors'
import { AstNode, SpecialExpressionNode } from '../../parser/interface'
import { string, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

interface ThrowSpecialExpressionNode extends SpecialExpressionNode {
  name: `throw`
  messageNode: AstNode
}

export const throwSpecialExpression: BuiltinSpecialExpression<null> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, messageNode] = parseToken(tokens, position)
    position = newPosition

    token.assert(tokens[position], `EOF`, { type: `paren`, value: `)` })
    position += 1

    const node: ThrowSpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `throw`,
      params: [],
      messageNode,
      token: firstToken.debugInfo ? firstToken : undefined,
    }
    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castThrowExpressionNode(node)
    const message = string.as(evaluateAstNode(node.messageNode, contextStack), node.token?.debugInfo, {
      nonEmpty: true,
    })
    throw new UserDefinedError(message, node.token?.debugInfo)
  },
  analyze: (node, contextStack, { analyzeAst }) => {
    castThrowExpressionNode(node)
    return analyzeAst(node.messageNode, contextStack)
  },
}

function castThrowExpressionNode(_node: SpecialExpressionNode): asserts _node is ThrowSpecialExpressionNode {
  return
}
