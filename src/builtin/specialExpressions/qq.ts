import { Any } from '../../interface'
import { AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, token, nameNode, any } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const qqSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `??`,
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { lookUp, evaluateAstNode }) => {
    const [firstNode, secondNode] = node.p

    if (nameNode.is(firstNode)) {
      const lookUpResult = lookUp(firstNode, contextStack)
      if (!(lookUpResult.builtinFunction || lookUpResult.contextEntry || lookUpResult.specialExpression)) {
        return secondNode ? evaluateAstNode(secondNode, contextStack) : null
      }
    }
    any.assert(firstNode, node.tkn?.d)
    const firstResult = evaluateAstNode(firstNode, contextStack)
    return firstResult ? firstResult : secondNode ? evaluateAstNode(secondNode, contextStack) : firstResult
  },
  validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
