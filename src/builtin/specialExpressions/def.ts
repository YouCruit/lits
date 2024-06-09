import { AstNodeType } from '../../constants/constants'
import type { AstNode, NameNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { asNameNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

export interface DefNode {
  t: AstNodeType.SpecialExpression
  n: 'def'
  p: [NameNode, AstNode]
  tkn?: Token
}

export const defSpecialExpression: BuiltinSpecialExpression<null, DefNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
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
        tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
      } satisfies DefNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const name = node.p[0].v

    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)

    contextStack.globalContext[name] = {
      value: evaluateAstNode(node.p[1], contextStack),
    }

    return null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const subNode = node.p[1]
    const result = findUnresolvedIdentifiers([subNode], contextStack, builtin)
    const name = node.p[0].v
    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}
