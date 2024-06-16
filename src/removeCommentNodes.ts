import { AstNodeType } from './constants/constants'
import type { Ast, AstNode } from './parser/interface'
import { isNormalExpressionNode } from './typeGuards/astNode'

export function removeCommenNodes(ast: Ast): void {
  removeCommenNodesFromArray(ast.b)
  ast.b.forEach(recursivelyRemoveCommentNodes)
}

function recursivelyRemoveCommentNodes(astNode: AstNode) {
  if (isNormalExpressionNode(astNode)) {
    removeCommenNodesFromArray(astNode.p)
    astNode.p.forEach(recursivelyRemoveCommentNodes)
  }
}

function removeCommenNodesFromArray(astNodes: AstNode[]): void {
  let i = astNodes.findIndex(n => n.t === AstNodeType.Comment)
  while (i >= 0) {
    astNodes.splice(i, 1)
    i = astNodes.findIndex(n => n.t === AstNodeType.Comment)
  }
}
