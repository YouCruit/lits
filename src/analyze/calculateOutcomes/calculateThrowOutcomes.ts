import type { ThrowNode } from '../../builtin/specialExpressions/throw'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateThrowOutcomes: CalculatePossibleAstNodesHelper<ThrowNode> = ({
  astNode,
  calculatePossibleAstNodes,
}) => {
  return calculatePossibleAstNodes(astNode.m).map<ThrowNode>(m => ({
    ...astNode,
    m,
  }))
}
