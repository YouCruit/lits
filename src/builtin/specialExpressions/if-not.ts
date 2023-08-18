import { Any } from '../../interface'
import { AstNodeType } from '../../parser/interface'
import { assertNumberOfParams, astNode, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'

export const ifNotSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: `if-not`,
        p: params,
        tkn: firstToken.d ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const debugInfo = node.tkn?.d

    const [conditionNode, trueNode, falseNode] = node.p
    if (!evaluateAstNode(astNode.as(conditionNode, debugInfo), contextStack)) {
      return evaluateAstNode(astNode.as(trueNode, debugInfo), contextStack)
    } else {
      if (node.p.length === 3) {
        return evaluateAstNode(astNode.as(falseNode, debugInfo), contextStack)
      } else {
        return null
      }
    }
  },
  validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
