import { EvaluateAstNode, ExecuteFunction, LookUpResult } from '../evaluator/interface'
import {
  ParseArgument,
  ParseBindings,
  ParseExpression,
  ParseTokens,
  ParseToken,
  ParseBinding,
  NameNode,
  SpecialExpressionNode,
} from '../parser/interface'
import { Token, DebugInfo } from '../tokenizer/interface'
import { NormalExpressionNode } from '../parser/interface'
import { Any, Arr } from '../interface'
import { FindUndefinedSymbols, UndefinedSymbolEntry } from '../analyze/undefinedSymbols/interface'
import { GetDataType } from '../analyze/dataTypes/interface'
import { DataType } from '../analyze/dataTypes/DataType'
import { ContextStack } from '../ContextStack'

export type NormalExpressionEvaluator<T> = (
  params: Arr,
  debugInfo: DebugInfo | undefined,
  contextStack: ContextStack,
  { executeFunction }: { executeFunction: ExecuteFunction },
) => T
type ValidateNode = (node: NormalExpressionNode) => void

type BuiltinNormalExpression<T> = {
  evaluate: NormalExpressionEvaluator<T>
  validate: ValidateNode
  getDataType?(
    node: SpecialExpressionNode,
    params: {
      contextStack: ContextStack
      getDataType: GetDataType
    },
  ): DataType
}

export type ParserHelpers = {
  parseExpression: ParseExpression
  parseTokens: ParseTokens
  parseToken: ParseToken
  parseBinding: ParseBinding
  parseBindings: ParseBindings
  parseArgument: ParseArgument
}

export type BuiltinNormalExpressions = Record<string, BuiltinNormalExpression<Any>>
export type BuiltinSpecialExpressions = Record<string, BuiltinSpecialExpression<Any>>

type EvaluateHelpers = {
  evaluateAstNode: EvaluateAstNode
  builtin: Builtin
  lookUp(nameNode: NameNode, contextStack: ContextStack): LookUpResult
}
export type BuiltinSpecialExpression<T> = {
  parse: (tokens: Token[], position: number, parsers: ParserHelpers) => [number, SpecialExpressionNode]
  evaluate: (node: SpecialExpressionNode, contextStack: ContextStack, helpers: EvaluateHelpers) => T
  validate: (node: SpecialExpressionNode) => void
  findUndefinedSymbols(
    node: SpecialExpressionNode,
    contextStack: ContextStack,
    params: { findUndefinedSymbols: FindUndefinedSymbols; builtin: Builtin },
  ): Set<UndefinedSymbolEntry>
  getDataType?(
    node: SpecialExpressionNode,
    params: { nameTypes: Array<Record<string, DataType>>; getDataType: GetDataType },
  ): DataType
}

export type SpecialExpressionName =
  | `and`
  | `block`
  | `comment`
  | `cond`
  | `def`
  | `defn`
  | `defns`
  | `defs`
  | `do`
  | `doseq`
  | `fn`
  | `for`
  | `function`
  | `if-let`
  | `if-not`
  | `if`
  | `let`
  | `loop`
  | `or`
  | `partial`
  | `recur`
  | `return-from`
  | `return`
  | `throw`
  | `time!`
  | `try`
  | `when-first`
  | `when-let`
  | `when-not`
  | `when`
  | `declared?`

export type Builtin = {
  normalExpressions: BuiltinNormalExpressions
  specialExpressions: BuiltinSpecialExpressions
}
