import type { Outcomes } from '..'
import { builtin } from '../../builtin'
import { AstNodeType } from '../../constants/constants'
import { evaluate } from '../../evaluator'
import type { ContextStack } from '../../evaluator/ContextStack'
import type { Context } from '../../evaluator/interface'
import type { Ast, AstNode } from '../../parser/interface'
import { findUnresolvedIdentifiers } from '../findUnresolvedIdentifiers'
import { combinate } from '../utils'
import { specialExpressionCalculator } from './specialExpressionCalculators'

export type CalculatePossibleAstNodes = (astNode: AstNode, indentifiers?: string[]) => AstNode[]
export type CombinateAstNodes = (astNodes: AstNode[], indentifiers?: string[]) => AstNode[][]
export type IsAstComputable = (node: AstNode | AstNode[] | AstNode[][]) => boolean
export type AddGlobaleIdentifier = (name: string) => void

export interface CalculatePossibleAstNodesHelperOptions<T extends AstNode> {
  astNode: T
  nilNode: AstNode
  calculatePossibleAstNodes: CalculatePossibleAstNodes
  combinateAstNodes: CombinateAstNodes
  isAstComputable: IsAstComputable
  addGlobalIdentifier: AddGlobaleIdentifier
}

export type CalculatePossibleAstNodesHelper<T extends AstNode> = (
  options: CalculatePossibleAstNodesHelperOptions<T>,
) => AstNode[]

function isIdempotent(normalExpressionName: string): boolean {
  return !normalExpressionName.endsWith('!')
    || normalExpressionName === 'write!'
}

export function calculateOutcomes(contextStack: ContextStack, astNodes: AstNode[]): Outcomes | null {
  const possibleAsts = calculatePossibleAsts(contextStack.clone(), astNodes)

  if (possibleAsts === null)
    return null

  const outcomes: Outcomes = []

  for (const possibleAst of possibleAsts) {
    const unresolvedIdentifiers = findUnresolvedIdentifiers(possibleAst, contextStack.clone(), builtin)
    if (unresolvedIdentifiers.size !== 0)
      return null

    const ast: Ast = {
      b: possibleAst,
      debug: true,
    }
    try {
      const outcome = evaluate(ast, contextStack.clone())

      if ([...outcomes].some(o => JSON.stringify(o) === JSON.stringify(outcome)))
        continue

      outcomes.push(outcome)
    }
    catch (e) {
      outcomes.push(e)
    }
  }

  return outcomes
}

function calculatePossibleAsts(contextStack: ContextStack, astNodes: AstNode[]): AstNode[][] | null {
  let possibleAsts: AstNode[][]

  try {
    possibleAsts = combinate(
      astNodes.map(
        astNode => calculatePossibleAstNodes(contextStack, astNode),
      ),
    )
  }
  catch (e) {
    return null
  }
  return possibleAsts
}

const nilNode: AstNode = { t: AstNodeType.ReservedName, v: 'nil' }

function calculatePossibleAstNodes(contextStack: ContextStack, astNode: AstNode, newIndentifiers?: string[]): AstNode[] {
  const newContext = newIndentifiers
    ? newIndentifiers.reduce((acc: Context, identity) => {
      acc[identity] = { value: null }
      return acc
    }, {})
    : undefined
  const newContextStack = newContext ? contextStack.create(newContext) : contextStack

  if (astNode.t === AstNodeType.NormalExpression) {
    if (astNode.n && !isIdempotent(astNode.n))
      throw new Error(`NormalExpressionNode with name ${astNode.n} is not idempotent. Cannot calculate possible ASTs.`)

    return combinate(astNode.p.map(n => calculatePossibleAstNodes(newContextStack, n)))
      .map(p => ({ ...astNode, p }))
  }
  else if (astNode.t === AstNodeType.SpecialExpression) {
    const helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'> = {
      nilNode,
      calculatePossibleAstNodes: (node: AstNode, identifiers?: string[]) => calculatePossibleAstNodes(newContextStack.clone(), node, identifiers),
      combinateAstNodes: (nodes: AstNode[], identifiers?: string[]) =>
        combinate(nodes.map(node => calculatePossibleAstNodes(newContextStack.clone(), node, identifiers))),
      isAstComputable: (node: AstNode | AstNode[] | AstNode[][]) => calculateOutcomes(newContextStack.clone(), Array.isArray(node) ? node.flat() : [node]) !== null,
      addGlobalIdentifier: (name: string) => newContextStack.globalContext[name] = { value: null },
    }

    // eslint-disable-next-line ts/no-unsafe-argument
    return specialExpressionCalculator[astNode.n](astNode as any, helperOptions)
  }
  return [astNode]
}
