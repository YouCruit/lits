import type { QqNode } from '../../builtin/specialExpressions/qq'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateQqOutcomes: CalculatePossibleAstNodesHelper<QqNode> = ({
  astNode,
  combinateAstNodes,
  isAstComputable,
}) => {
  if (!isAstComputable(astNode.p[0]!))
    throw new Error('First argument of ?? not computable')

  return combinateAstNodes(astNode.p)
    .map(p => ({
      ...astNode,
      p,
    }))
}
