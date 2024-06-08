import { AstNodeType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { assertNumberOfParams } from '../../typeGuards'
import { asAstNode } from '../../typeGuards/astNode'
import { assertString } from '../../typeGuards/string'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import { assertNameNotDefined } from '../utils'

export interface DefsNode {
  t: AstNodeType.SpecialExpression
  n: 'defs'
  p: AstNode[]
  tkn?: Token
}

export const defsSpecialExpression: BuiltinSpecialExpression<null, DefsNode> = {
  parse: (tokenStream, position, { parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    return [
      newPosition + 1,
      {
        t: AstNodeType.SpecialExpression,
        n: 'defs',
        p: params,
        tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
      } satisfies DefsNode,
    ]
  },
  evaluate: (node, contextStack, { evaluateAstNode, builtin }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const name = evaluateAstNode(asAstNode(node.p[0], sourceCodeInfo), contextStack)
    assertString(name, sourceCodeInfo)

    assertNameNotDefined(name, contextStack, builtin, node.tkn?.sourceCodeInfo)

    contextStack.globalContext[name] = {
      value: evaluateAstNode(asAstNode(node.p[1], sourceCodeInfo), contextStack),
    }

    return null
  },
  validate: node => assertNumberOfParams(2, node),
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin, evaluateAstNode }) => {
    const sourceCodeInfo = node.tkn?.sourceCodeInfo
    const subNode = asAstNode(node.p[1], sourceCodeInfo)
    const result = findUnresolvedIdentifiers([subNode], contextStack, builtin)
    const name = evaluateAstNode(asAstNode(node.p[0], sourceCodeInfo), contextStack)
    assertString(name, sourceCodeInfo)
    assertNameNotDefined(name, contextStack, builtin, sourceCodeInfo)
    contextStack.globalContext[name] = { value: true }
    return result
  },
}
