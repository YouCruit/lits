import { AstNodeType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { assertNumberOfParams } from '../../typeGuards'
import { asAstNode, asNameNode, assertNameNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'
import type { SpecialExpressionNode } from '..'

export interface DefNode {
  t: AstNodeType.SpecialExpression
  n: 'def'
  p: AstNode[]
  tkn?: Token
}

export const defSpecialExpression: BuiltinSpecialExpression<null, DefNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    assertNameNode(params[0], firstToken.sourceCodeInfo)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'def',
        p: params,
        tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
      } satisfies DefNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const name = asNameNode(node.p[0], sourceCodeInfo).v

    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)

    contextStack.globalContext[name] = {
      value: evaluateAstNode(asAstNode(node.p[1], sourceCodeInfo), contextStack),
    }

    return null
  },
  validate: node => assertNumberOfParams(2, node),
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const subNode = asAstNode(node.p[1], sourceCodeInfo)
    const result = findUnresolvedIdentifiers([subNode], contextStack, builtin)
    const name = asNameNode(node.p[0], sourceCodeInfo).v
    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}
