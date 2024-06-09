import type { DoNode } from '../../builtin/specialExpressions/do'
import type { TimeNode } from '../../builtin/specialExpressions/time'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateTimeOutcomes: CalculatePossibleAstNodesHelper<TimeNode> = ({
  astNode,
  calculatePossibleAstNodes,
}) => {
  return calculatePossibleAstNodes(astNode.p)
    .map<DoNode>(p => ({
      ...astNode,
      n: 'do',
      p: [p],
    }))
}
