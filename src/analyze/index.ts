import { type LitsParams, createContextStack } from '../Lits/Lits'
import type { Builtin } from '../builtin/interface'
import type { ContextStack } from '../evaluator/ContextStack'
import type { Ast, AstNode } from '../parser/interface'
import type { Token } from '../tokenizer/interface'
import { calculateOutcomes } from './calculateOutcomes'
import { findUnresolvedIdentifiers } from './findUnresolvedIdentifiers'

export interface UnresolvedIdentifier {
  symbol: string
  token: Token | undefined
}

// A set of unresolved identifiers
export type UnresolvedIdentifiers = Set<UnresolvedIdentifier>

// A set of potential outcomes from evaluating the AST
export type Outcomes = Set<unknown>

// The result of analyzing an AST
export interface Analysis {
  unresolvedIdentifiers: UnresolvedIdentifiers
  outcomes: Outcomes | null
}

// A function that finds unresolved identifiers in an AST node or array of AST nodes
export type FindUnresolvedIdentifiers = (ast: Ast | AstNode[], contextStack: ContextStack, builtin: Builtin) => UnresolvedIdentifiers

export function analyze(ast: Ast, params: LitsParams, builtin: Builtin): Analysis {
  return {
    unresolvedIdentifiers: findUnresolvedIdentifiers(ast, createContextStack(params), builtin),
    outcomes: calculateOutcomes(ast, params, builtin),
  }
}
