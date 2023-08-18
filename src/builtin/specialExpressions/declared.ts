import { AstNodeType, SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, token, nameNode } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const declaredSpecialExpression: BuiltinSpecialExpression<boolean> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `declared?`,
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { lookUp }) => {
    const [astNode] = node.p
    nameNode.assert(astNode, node.tkn?.d)

    const lookUpResult = lookUp(astNode, contextStack)
    return !!(lookUpResult.builtinFunction || lookUpResult.contextEntry || lookUpResult.specialExpression)
  },
  validate: node => assertNumberOfParams(1, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
