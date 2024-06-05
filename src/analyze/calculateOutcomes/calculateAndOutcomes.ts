import type { AndNode } from '../../builtin/specialExpressions/and'
import { AstNodeType } from '../../constants/constants'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateAndOutcomes: CalculatePossibleAstNodesHelper<AndNode> = ({
  astNode,
  combinateAstNodes,
}) => {
  return combinateAstNodes(astNode.p)
    .map(p => ({
      n: 'and',
      t: AstNodeType.SpecialExpression,
      p,
      tkn: astNode.tkn,
    } satisfies AndNode))
}
