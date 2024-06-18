import type { SpecialExpressionName, SpecialExpressionNode } from '../../builtin'
import type { AndNode } from '../../builtin/specialExpressions/and'
import { AstNodeType } from '../../constants/constants'
import type { UnparseOptions } from '../UnparseOptions'
import { unparseNormalExpressionNode } from '../unparseNormalExpression'

const t = AstNodeType.NormalExpression

const specialExpressionUnparser = {
  and: (astNode: AndNode, options: UnparseOptions) =>
    unparseNormalExpressionNode({ ...astNode, t }, options),
  //   'comment': (astNode: CommentExpressionNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateCommentOutcomes({ astNode, ...helperOptions }),
  //   'cond': (astNode: CondNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateCondOutcomes({ astNode, ...helperOptions }),
  //   'declared?': (astNode: DeclaredNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDeclaredOutcomes({ astNode, ...helperOptions }),
  //   'defn': (astNode: DefnNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDefnOutcomes({ astNode, ...helperOptions }),
  //   'def': (astNode: DefNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDefOutcomes({ astNode, ...helperOptions }),
  //   'defns': (astNode: DefnsNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDefnsOutcomes({ astNode, ...helperOptions }),
  //   'defs': (astNode: DefsNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDefsOutcomes({ astNode, ...helperOptions }),
  //   'do': (astNode: DoNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDoOutcomes({ astNode, ...helperOptions }),
  //   'doseq': (astNode: DoSeqNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateDoSeqOutcomes({ astNode, ...helperOptions }),
  //   'fn': (astNode: FnNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateFnOutcomes({ astNode, ...helperOptions }),
  //   'for': (astNode: ForNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateForOutcomes({ astNode, ...helperOptions }),
  //   'if-let': (astNode: IfLetNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateIfLetOutcomes({ astNode, ...helperOptions }),
  //   'if': (astNode: IfNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateIfOutcomes({ astNode, ...helperOptions }),
  //   'if-not': (astNode: IfNotNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateIfNotOutcomes({ astNode, ...helperOptions }),
  //   'let': (astNode: LetNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateLetOutcomes({ astNode, ...helperOptions }),
  //   'loop': (astNode: LoopNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateLoopOutcomes({ astNode, ...helperOptions }),
  //   'or': (astNode: OrNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateOrOutcomes({ astNode, ...helperOptions }),
  //   '??': (astNode: QqNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateQqOutcomes({ astNode, ...helperOptions }),
  //   'recur': (astNode: RecurNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateRecurOutcomes({ astNode, ...helperOptions }),
  //   'time!': (astNode: TimeNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateTimeOutcomes({ astNode, ...helperOptions }),
  //   'throw': (astNode: ThrowNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateThrowOutcomes({ astNode, ...helperOptions }),
  //   'try': (astNode: TryNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateTryOutcomes({ astNode, ...helperOptions }),
  //   'when-first': (astNode: WhenFirstNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateWhenFirstOutcomes({ astNode, ...helperOptions }),
  //   'when-let': (astNode: WhenLetNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateWhenLetOutcomes({ astNode, ...helperOptions }),
  //   'when': (astNode: WhenNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateWhenOutcomes({ astNode, ...helperOptions }),
  //   'when-not': (astNode: WhenNotNode, helperOptions: Omit<CalculatePossibleAstNodesHelperOptions<AstNode>, 'astNode'>) => calculateWhenNotOutcomes({ astNode, ...helperOptions }),

} satisfies Record<Extract<SpecialExpressionName, 'and'>, unknown>

export function unparseSpecialExpression(node: SpecialExpressionNode, options: UnparseOptions): string {
  const unparser = specialExpressionUnparser[node.n as 'and']
  return unparser(node as AndNode, options)
}
