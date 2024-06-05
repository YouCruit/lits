import type { DefsNode } from '../../builtin/specialExpressions/defs'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateDefsOutcomes: CalculatePossibleAstNodesHelper<DefsNode> = ({
  astNode,
  combinateAstNodes,
}) => {
  return combinateAstNodes(astNode.p)
    .map<DefsNode>(p => ({
      ...astNode,
      p,
    }))
}
