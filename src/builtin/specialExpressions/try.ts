import { LitsError } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, NameNode, SpecialExpressionNode } from '../../parser/interface'
import { any, nameNode, token } from '../../utils/assertion'
import { getDebugInfo } from '../../utils/helpers'
import { BuiltinSpecialExpression } from '../interface'

interface TrySpecialExpressionNode extends SpecialExpressionNode {
  name: `try`
  tryExpression: AstNode
  error: NameNode
  catchExpression: AstNode
}

export const trySpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    let tryExpression: AstNode
    ;[position, tryExpression] = parseToken(tokens, position)

    token.assert(tokens[position], `EOF`, { type: `paren`, value: `(` })
    position += 1

    let catchNode: AstNode
    ;[position, catchNode] = parseToken(tokens, position)
    nameNode.assert(catchNode, catchNode.token.debugInfo)
    if (catchNode.value !== `catch`) {
      throw new LitsError(
        `Expected 'catch', got '${catchNode.value}'.`,
        getDebugInfo(catchNode, catchNode.token.debugInfo),
      )
    }

    let error: AstNode
    ;[position, error] = parseToken(tokens, position)
    nameNode.assert(error, error.token.debugInfo)

    let catchExpression: AstNode
    ;[position, catchExpression] = parseToken(tokens, position)

    token.assert(tokens[position], `EOF`, { type: `paren`, value: `)` })
    position += 1

    token.assert(tokens[position], `EOF`, { type: `paren`, value: `)` })
    position += 1

    const node: TrySpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `try`,
      params: [],
      tryExpression,
      catchExpression,
      error,
      token: firstToken,
    }

    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castTryExpressionNode(node)
    try {
      return evaluateAstNode(node.tryExpression, contextStack)
    } catch (error) {
      const newContext: Context = {
        [node.error.value]: { value: any.as(error, node.token.debugInfo) },
      } as Context
      return evaluateAstNode(node.catchExpression, contextStack.withContext(newContext))
    }
  },
}

function castTryExpressionNode(_node: SpecialExpressionNode): asserts _node is TrySpecialExpressionNode {
  return
}
