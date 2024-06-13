import { AstNodeType } from '../../constants/constants'
import type { NameNode } from '../../parser/interface'
import type { Token } from '../../tokenizer/interface'
import { assertNumberOfParamsFromAstNodes } from '../../typeGuards'
import { asNameNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface DeclaredNode {
  t: AstNodeType.SpecialExpression
  n: 'declared?'
  p: NameNode
  tkn?: Token
}

export const declaredSpecialExpression: BuiltinSpecialExpression<boolean, DeclaredNode> = {
  parse: (tokenStream, position, { parseTokensUntilClosingBracket: parseTokens }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, params] = parseTokens(tokenStream, position)
    assertNumberOfParamsFromAstNodes({
      name: 'declared?',
      count: 1,
      params,
      sourceCodeInfo: firstToken.sourceCodeInfo,
    })

    const node: DeclaredNode = {
      t: AstNodeType.SpecialExpression,
      n: 'declared?',
      p: asNameNode(params[0], firstToken.sourceCodeInfo),
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack) => {
    const lookUpResult = contextStack.lookUp(node.p)
    return lookUpResult !== null
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers([node.p], contextStack, builtin),
}
