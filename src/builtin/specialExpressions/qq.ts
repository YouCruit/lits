import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { SpecialExpressionNode } from '../../parser/interface'
import { assertAny, assertNumberOfParams } from '../../utils/assertion'
import { isNameNode } from '../../utils/astNodeAsserter'
import { asToken } from '../../utils/tokenAsserter'
import type { BuiltinSpecialExpression } from '../interface'

export const qqSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = asToken(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `??`,
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [firstNode, secondNode] = node.p

    if (isNameNode(firstNode)) {
      if (contextStack.lookUp(firstNode) === null) {
        return secondNode ? evaluateAstNode(secondNode, contextStack) : null
      }
    }
    assertAny(firstNode, node.tkn?.d)
    const firstResult = evaluateAstNode(firstNode, contextStack)
    return firstResult ? firstResult : secondNode ? evaluateAstNode(secondNode, contextStack) : firstResult
  },
  validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
