import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import { assertNumberOfParams } from '../../typeGuards'
import { asAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export const ifSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: `if`,
        p: params,
        tkn: firstToken.d ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const debugInfo = node.tkn?.d

    const [conditionNode, trueNode, falseNode] = node.p
    if (evaluateAstNode(asAstNode(conditionNode, debugInfo), contextStack)) {
      return evaluateAstNode(asAstNode(trueNode, debugInfo), contextStack)
    } else {
      if (node.p.length === 3) {
        return evaluateAstNode(asAstNode(falseNode, debugInfo), contextStack)
      } else {
        return null
      }
    }
  },
  validate: node => assertNumberOfParams({ min: 2, max: 3 }, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
