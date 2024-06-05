import type { CondNode } from '../../builtin/specialExpressions/cond'
import type { AstNode } from '../../parser/interface'
import { combinate } from '../utils'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateCondOutcomes: CalculatePossibleAstNodesHelper<CondNode> = ({
  astNode,
  nilNode,
  calculatePossibleAstNodes,
  isAstComputable,
}) => {
  const testNodes = astNode.c.map(({ t }) => t)
  if (isAstComputable(testNodes)) {
    return combinate(astNode.c
      // Create a list of ast nodes from the test and form of each condition
      .reduce((acc: AstNode[][], condition) => {
        acc.push(calculatePossibleAstNodes(condition.t), calculatePossibleAstNodes(condition.f))
        return acc
      }, []),
    )
      // Create a new CondNode for each combination of test and form outcomes
      .map<CondNode>(conditionAsts => ({
        ...astNode,
        c: arrayToPairs(conditionAsts).map(([t, f]) => ({ t: t!, f: f! })),
      }))
  }

  return [
    ...astNode.c.flatMap(condition => calculatePossibleAstNodes(condition.f)),
    nilNode,
  ]
}

function arrayToPairs(arr: AstNode[]): AstNode[][] {
  const pairs: AstNode[][] = []
  for (let i = 0; i < arr.length; i += 2)
    pairs.push([arr[i]!, arr[i + 1]!])

  return pairs
}
