import type { SpecialExpressionNode } from '../builtin'
import type { AndNode } from '../builtin/specialExpressions/and'
import type { DeclaredNode } from '../builtin/specialExpressions/declared'
import type { ThrowNode } from '../builtin/specialExpressions/throw'
import type { TimeNode } from '../builtin/specialExpressions/time'
import type { RemoveOptions } from '.'

const specialExpressionCommentRemovers = {
  'and': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  'comment': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  // 'cond': (astNode: CondNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  'declared?': (node: DeclaredNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  // 'defn': (astNode: DefnNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  'def': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  // 'defns': (astNode: DefnsNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  'defs': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  // 'do': (astNode: DoNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'doseq': (astNode: DoSeqNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'fn': (astNode: FnNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'for': (astNode: ForNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'if-let': (astNode: IfLetNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  'if': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  'if-not': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  // 'let': (astNode: LetNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'loop': (astNode: LoopNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  'or': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  '??': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  'recur': (node: AndNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  'time!': (node: TimeNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  'throw': (node: ThrowNode, removeOptions: RemoveOptions) => {
    removeOptions.removeCommenNodesFromArray(node.p)
    node.p.forEach(removeOptions.recursivelyRemoveCommentNodes)
  },
  // 'try': (astNode: TryNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'when-first': (astNode: WhenFirstNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'when-let': (astNode: WhenLetNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'when': (astNode: WhenNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),
  // 'when-not': (astNode: WhenNotNode, options: UnparseOptions) => unparseNormalExpressionNode({ ...astNode, t }, options),

} satisfies Record<string /* TODO: SpecialExpressionName */, (astNode: any, removeOptions: RemoveOptions) => void>

export function removeCommentNodesFromSpecialExpression(
  node: SpecialExpressionNode,
  removeOptions: RemoveOptions,
) {
  const uncommenter = specialExpressionCommentRemovers[node.n as 'and']
  return uncommenter?.(node as AndNode, removeOptions)
}
