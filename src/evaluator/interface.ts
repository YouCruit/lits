import { ContextStack } from './ContextStack'
import { LazyValue } from '../Lits/Lits'
import { Any, Arr } from '../interface'
import { AstNode, BuiltinFunction } from '../parser/interface'
import { DebugInfo } from '../tokenizer/interface'
import { isUnknownRecord } from '../utils/assertion'

export type ContextEntry = { value: Any }
export type Context = Record<string, ContextEntry>

export type EvaluateAstNode = (node: AstNode, contextStack: ContextStack) => Any
export type ExecuteFunction = (fn: Any, params: Arr, contextStack: ContextStack, debugInfo?: DebugInfo) => Any

export type LookUpResult = ContextEntry | BuiltinFunction | LazyValue | `specialExpression` | null

export function isContextEntry(value: unknown): value is ContextEntry {
  return isUnknownRecord(value) && value.value !== undefined
}
