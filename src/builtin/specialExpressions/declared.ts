import { AstNodeType } from '../../constants/constants'
import type { SpecialExpressionNode } from '../../parser/interface'
import { assertNumberOfParams } from '../../utils/assertion'
import { assertNameNode } from '../../utils/astNodeAsserter'
import { asToken } from '../../utils/tokenAsserter'
import type { BuiltinSpecialExpression } from '../interface'

export const declaredSpecialExpression: BuiltinSpecialExpression<boolean> = {
  parse: (tokens, position, { parseTokens }) => {
    const firstToken = asToken(tokens[position], `EOF`)
    const [newPosition, params] = parseTokens(tokens, position)
    const node: SpecialExpressionNode = {
      t: AstNodeType.SpecialExpression,
      n: `declared?`,
      p: params,
      tkn: firstToken.d ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack) => {
    const [astNode] = node.p
    assertNameNode(astNode, node.tkn?.d)

    const lookUpResult = contextStack.lookUp(astNode)
    return lookUpResult !== null
  },
  validate: node => assertNumberOfParams(1, node),
  analyze: (node, contextStack, { analyzeAst, builtin }) => analyzeAst(node.p, contextStack, builtin),
}
