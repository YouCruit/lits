import { AstNodeType } from '../../constants/constants'
import type { Any } from '../../interface'
import type { AstNode, GenericNode } from '../../parser/interface'
import { assertAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'

export interface TimeNode extends GenericNode {
  t: AstNodeType.SpecialExpression
  n: 'time!'
  p: AstNode
}

export const timeSpecialExpression: BuiltinSpecialExpression<Any, TimeNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, astNode] = parseToken(tokenStream, position)
    const node: TimeNode = {
      t: AstNodeType.SpecialExpression,
      n: 'time!',
      p: astNode,
      debug: firstToken.sourceCodeInfo
        ? {
            token: firstToken,
          }
        : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const param = node.p
    assertAstNode(param, node.debug?.token.sourceCodeInfo)

    const startTime = Date.now()
    const result = evaluateAstNode(param, contextStack)
    const totalTime = Date.now() - startTime
    // eslint-disable-next-line no-console
    console.log(`Elapsed time: ${totalTime} ms`)

    return result
  },
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers([node.p], contextStack, builtin),
}
