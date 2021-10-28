import { UnexpectedNodeTypeError, UnexpectedTokenError } from '../../errors'
import { Context } from '../../evaluator/interface'
import { Any } from '../../interface'
import { AstNode, NameNode, SpecialExpressionNode } from '../../parser/interface'
import { asNotUndefined } from '../../utils'
import { BuiltinSpecialExpression } from '../interface'

interface TrySpecialExpressionNode extends SpecialExpressionNode {
  name: `try`
  tryExpression: AstNode
  error: NameNode
  catchExpression: AstNode
}

export const trySpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    let tryExpression: AstNode
    ;[position, tryExpression] = parseToken(tokens, position)

    let token = asNotUndefined(tokens[position])
    if (!(token.type === `paren` && token.value === `(`)) {
      throw new UnexpectedTokenError(`(`, token)
    }
    position += 1

    token = asNotUndefined(tokens[position])
    if (!(token.type === `paren` && token.value === `(`)) {
      throw new UnexpectedTokenError(`(`, token)
    }

    position += 1
    let error: AstNode
    ;[position, error] = parseToken(tokens, position)
    if (error.type !== `Name`) {
      throw new UnexpectedNodeTypeError(`Name`, error)
    }

    token = asNotUndefined(tokens[position])
    if (!(token.type === `paren` && token.value === `)`)) {
      throw new UnexpectedTokenError(`)`, token)
    }
    position += 1

    let catchExpression: AstNode
    ;[position, catchExpression] = parseToken(tokens, position)

    token = asNotUndefined(tokens[position])
    if (!(token.type === `paren` && token.value === `)`)) {
      throw new UnexpectedTokenError(`)`, token)
    }
    position += 1

    token = asNotUndefined(tokens[position])
    if (!(token.type === `paren` && token.value === `)`)) {
      throw new UnexpectedTokenError(`)`, token)
    }
    position += 1

    const node: TrySpecialExpressionNode = {
      type: `SpecialExpression`,
      name: `try`,
      params: [],
      tryExpression,
      catchExpression,
      error,
    }

    return [position, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    castTryExpressionNode(node)
    try {
      return evaluateAstNode(node.tryExpression, contextStack)
    } catch (error) {
      const newContext: Context = { [node.error.value]: { value: asNotUndefined(error) } } as Context
      return evaluateAstNode(node.catchExpression, contextStack.withContext(newContext))
    }
  },
}

function castTryExpressionNode(_node: SpecialExpressionNode): asserts _node is TrySpecialExpressionNode {
  return
}
