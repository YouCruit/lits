import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import { assertNumberOfParams } from '../../typeGuards'
import { assertNameNode, asNameNode, asAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

export const defSpecialExpression: BuiltinSpecialExpression<Any> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = asToken(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    assertNameNode(params[0], firstToken.d)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: `def`,
        p: params,
        tkn: firstToken.d ? firstToken : undefined,
      },
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const debugInfo = node.tkn?.d
    const name = asNameNode(node.p[0], debugInfo).v

    assertNameNotDefined(name, contextStack, builtin, debugInfo)

    const value = evaluateAstNode(asAstNode(node.p[1], debugInfo), contextStack)

    contextStack.globalContext[name] = { value }

    return value
  },
  validate: node => assertNumberOfParams(2, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => {
    const debugInfo = node.tkn?.d
    const subNode = asAstNode(node.p[1], debugInfo)
    const result = analyzeAst(subNode, contextStack, builtin)
    const name = asNameNode(node.p[0], debugInfo).v
    assertNameNotDefined(name, contextStack, builtin, debugInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}
