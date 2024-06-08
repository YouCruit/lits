import type { CommentNode } from '../../builtin/specialExpressions/comment'
import type { CalculatePossibleAstNodesHelper } from '.'

export const calculateCommentOutcomes: CalculatePossibleAstNodesHelper<CommentNode> = ({
  nilNode,
}) => {
  return [nilNode]
}
