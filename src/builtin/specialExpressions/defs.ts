import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import { asAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'
import { assertString } from '../../typeGuards/string'
import { assertNumberOfParams } from '../../typeGuards'

export const defsSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = asToken(tokens[position], `EOF`)
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
    const name = evaluateAstNode(asAstNode(node.p[0], debugInfo), contextStack)
    assertString(name, debugInfo)

    assertNameNotDefined(name, contextStack, builtin, node.tkn?.d)

    const value = evaluateAstNode(asAstNode(node.p[1], debugInfo), contextStack)

    contextStack.globalContext[name] = { value }

    return value
  },
  validate: node => assertNumberOfParams(2, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const subNode = asAstNode(node.p[1], node.tkn?.d)
    return analyzeAst(subNode, contextStack, builtin)
  },
}
