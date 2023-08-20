import { Any } from '../../interface'
import { AstNodeType } from '../../parser/AstNodeType'
import { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams, astNode } from '../../utils/assertion'
import { token } from '../../utils/tokenAssertion'
import { BuiltinSpecialExpression } from '../interface'

export const timeSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseToken }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, astNode] = parseToken(tokens, position)
    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `time!`,
      p: [astNode],
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [param] = node.p
    astNode.assert(param, node.tkn?.d)

    const startTime = Date.now()
    const result = evaluateAstNode(param, contextStack)
    const totalTime = Date.now() - startTime
    // eslint-disable-next-line no-console
    console.log(`Elapsed time: ${totalTime} ms`)

    return result
  },
  validate: node => assertNumberOfParams(1, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
