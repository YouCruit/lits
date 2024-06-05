import type { Any } from '../../interface'
import { AstNodeType } from '../../constants/constants'
import type { AstNode } from '../../parser/interface'
import { assertNumberOfParams } from '../../typeGuards'
import { assertAstNode } from '../../typeGuards/astNode'
import { asToken } from '../../typeGuards/token'
import type { BuiltinSpecialExpression } from '../interface'
import type { Token } from '../../tokenizer/interface'
import type { SpecialExpressionNode } from '..'

export interface TimeNode {
  t: AstNodeType.SpecialExpression
  n: 'time!'
  p: AstNode[]
  tkn?: Token
}

export const timeSpecialExpression: BuiltinSpecialExpression<Any, TimeNode> = {
  parse: (tokenStream, position, { parseToken }) => {
    const firstToken = asToken(tokenStream.tokens[position], tokenStream.filePath)
    const [newPosition, astNode] = parseToken(tokenStream, position)
    const node: TimeNode = {
      t: AstNodeType.SpecialExpression,
      n: 'time!',
      p: [astNode],
      tkn: firstToken.sourceCodeInfo ? firstToken : undefined,
    }

    return [newPosition + 1, node]
  },
  evaluate: (node, contextStack, { evaluateAstNode }) => {
    const [param] = node.p
    assertAstNode(param, node.tkn?.sourceCodeInfo)

    const startTime = Date.now()
    const result = evaluateAstNode(param, contextStack)
    const totalTime = Date.now() - startTime
    // eslint-disable-next-line no-console
    console.log(`Elapsed time: ${totalTime} ms`)

    return result
  },
  validate: node => assertNumberOfParams(1, node),
  findUnresolvedIdentifiers: (node, contextStack, { findUnresolvedIdentifiers, builtin }) => findUnresolvedIdentifiers(node.p, contextStack, builtin),
}
