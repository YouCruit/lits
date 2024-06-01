import type { Outcomes } from '..'
import { type LitsParams, createContextStack } from '../../Lits/Lits'
import type { Builtin } from '../../builtin/interface'
import type { DoNode } from '../../builtin/specialExpressions/do'
import type { LetNode } from '../../builtin/specialExpressions/let'
import type { QqNode } from '../../builtin/specialExpressions/qq'
import { AstNodeType } from '../../constants/constants'
import { evaluate } from '../../evaluator'
import type { Ast, AstNode, BindingNode } from '../../parser/interface'
import { findUnresolvedIdentifiers } from '../findUnresolvedIdentifiers'
import { combinate } from '../utils'

function isIdempotent(normalExpressionName: string): boolean {
  return !normalExpressionName.endsWith('!')
    || normalExpressionName === 'write!'
}

export function calculateOutcomes(astNode: Ast, params: LitsParams, builtin: Builtin): Outcomes | null {
  let possibleAsts: Ast[]

  try {
    possibleAsts = combinate(astNode.b.map(calculatePossibleAsts))
      .map((b) => {
        return {
          ...astNode,
          b,
        }
      })
  }
  catch (e) {
    return null
  }

  const outcomes = new Set<unknown>()

  for (const ast of possibleAsts) {
    const unresolvedIdentifiers = findUnresolvedIdentifiers(ast, createContextStack(params), builtin)
    if (unresolvedIdentifiers.size !== 0)
      return null

    const outcome = evaluate(ast, createContextStack(params))

    if ([...outcomes].some(o => JSON.stringify(o) === JSON.stringify(outcome)))
      continue

    outcomes.add(outcome)
  }

  return outcomes
}

const nilNode: AstNode = { t: AstNodeType.ReservedName, v: 'nil' }
const trueNode: AstNode = { t: AstNodeType.ReservedName, v: 'true' }
const falseNode: AstNode = { t: AstNodeType.ReservedName, v: 'false' }

function calculatePossibleAsts(astNode: AstNode): AstNode[] {
  if (astNode.t === AstNodeType.SpecialExpression) {
    switch (astNode.n) {
      case '??': {
        const qqNode: QqNode = {
          t: AstNodeType.SpecialExpression,
          n: '??',
          p: [astNode.p[0]!],
        }
        return astNode.p.length === 2
          ? [qqNode, ...calculatePossibleAsts(astNode.p[1]!)]
          : [qqNode]
      }
      case 'and':
      case 'or': {
        return astNode.p.map(calculatePossibleAsts).flat()
      }
      case 'comment':
        return [nilNode]
      case 'cond': {
        const conditionsValues = astNode.c!.map(c => c.f)
        return conditionsValues.map(calculatePossibleAsts).flat()
      }
      case 'declared?':
        return [trueNode, falseNode]
      case 'do': {
        const doNodes: DoNode[] = combinate(astNode.p.map(calculatePossibleAsts))
          .map(p => ({
            n: 'do',
            t: AstNodeType.SpecialExpression,
            p,
            tkn: astNode.tkn,
          }))
        return [...doNodes, nilNode]
      }
      case 'doseq': {
        return [nilNode]
      }
      case 'if-not':
      case 'if': {
        const thenBranch = astNode.p[1]!
        const elseBranch = astNode.p[2] ?? nilNode
        return [...calculatePossibleAsts(thenBranch), ...calculatePossibleAsts(elseBranch)]
      }
      case 'if-let': {
        const thenBranch = astNode.p[0]!
        const elseBranch = astNode.p[1] ?? nilNode
        const letNodes: LetNode[] = calculatePossibleAsts(thenBranch)
          .flatMap(then => calculatePossibleAsts(astNode.b!.v).map((v) => {
            return {
              t: AstNodeType.SpecialExpression,
              n: 'let',
              bs: [{
                ...astNode.b!,
                v,
              }],
              p: [then],
            }
          }))
        return [
          ...letNodes,
          elseBranch,
        ]
      }
      case 'when': {
        const doNodes: DoNode[] = combinate(astNode.p.map(calculatePossibleAsts))
          .map(p => ({
            n: 'do',
            t: AstNodeType.SpecialExpression,
            p,
            tkn: astNode.tkn,
          }))
        return [...doNodes, nilNode]
      }
      case 'when-let': {
        const letNodes: LetNode[] = combinate(astNode.p.map(calculatePossibleAsts))
          .flatMap(p => calculatePossibleAsts(astNode.b!.v).map((v) => {
            const letNode: LetNode = {
              n: 'let',
              bs: [{
                ...astNode.b!,
                v,
              }],
              t: AstNodeType.SpecialExpression,
              p,
              tkn: astNode.tkn,
            }
            return letNode
          }))
        return [...letNodes, nilNode]
      }
      case 'let': {
        const letNodes: LetNode[] = combinate(astNode.p.map(calculatePossibleAsts))
          .flatMap(p => combinate(astNode.bs!
            .map<BindingNode[]>(b => calculatePossibleAsts(b.v).map(v => ({ ...b, v }))),
          ).map((bs) => {
            return {
              n: 'let',
              bs,
              t: AstNodeType.SpecialExpression,
              p,
              tkn: astNode.tkn,
            }
          }))
        return letNodes
      }
      default:
        return [astNode]
    }
  }
  else if (astNode.t === AstNodeType.NormalExpression) {
    if (astNode.n && !isIdempotent(astNode.n))
      throw new Error(`NormalExpressionNode with name ${astNode.n} is not idempotent. Cannot calculate possible ASTs.`)

    return combinate(astNode.p.map(calculatePossibleAsts))
      .map(p => ({ ...astNode, p }))
  }
  else {
    return [astNode]
  }
}
