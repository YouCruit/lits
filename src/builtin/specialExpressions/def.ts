import { AstNodeType } from '../../constants/constants'
import type { AstNode, GenericNode, NameNode } from '../../parser/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { asNameNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

export interface DefNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'def'
  p: [NameNode, AstNode]
}

export const defSpecialExpression: BuiltinSpecialExpression<null, DefNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    assertNumberOfParamsFromAstNodes({
      name: 'def',
      count: 2,
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'def',
        p: [asNameNode(params[0], firstToken.sourceCodeInfo), params[1]!],
        debug: firstToken.sourceCodeInfo
          ? {
              token: firstToken,
            }
          : undefined,
      } satisfies DefNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const sourceCodeInfo = node.debug?.token.sourceCodeInfo
    const name = node.p[0].v

    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)

    contextStack.globalContext[name] = {
      value: evaluateAstNode(node.p[1], contextStack),
    }

    return null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const sourceCodeInfo = node.debug?.token.sourceCodeInfo
    const subNode = node.p[1]
    const result = findUnresolvedIdentifiers([subNode], contextStack, builtin)
    const name = node.p[0].v
    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}
