import { Builtin } from '../builtin/interface'
import { ContextStack } from '../evaluator/interface'
import { AstNode } from '../parser/interface'

export type AnalyzeResult = {
  undefinedSymbols: Set<string>
}
export type AnalyzeAst = (astNode: AstNode | AstNode[], contextStack: ContextStack, builtin: Builtin) => AnalyzeResult
