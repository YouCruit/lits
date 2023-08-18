import { Any } from '../../interface'
import { AstNodeType } from '../../parser/interface'
import { assertNumberOfParams, astNode, string, token } from '../../utils/assertion'
import { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

export const defsSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: `defs`,
        p: params,
        tkn: firstToken.d ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const debugInfo = node.tkn?.d
    const name = evaluateAstNode(astNode.as(node.p[0], debugInfo), contextStack)
    string.assert(name, debugInfo)

    assertNameNotDefined(name, contextStack, builtin, node.tkn?.d)

    const value = evaluateAstNode(astNode.as(node.p[1], debugInfo), contextStack)

    contextStack.globalContext[name] = { value }

    return value
  },
  validate: node => assertNumberOfParams(2, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const subNode = astNode.as(node.p[1], node.tkn?.d)
    return analyzeAst(subNode, contextStack, builtin)
  },
}
