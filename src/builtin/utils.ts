import { LitsError } from '../errors'
import { ContextStack } from '../evaluator/ContextStack'
import { AstNode, BindingNode } from '../parser/interface'
import { reservedNamesRecord } from '../reservedNames'
import { DebugInfo } from '../tokenizer/interface'
import { Builtin } from './interface'

export type Arity = number | { min: number }

export type FunctionOverload = {
  as: FunctionArguments
  a: Arity
  b: AstNode[]
}

export type FunctionArguments = {
  m: string[]
  r?: string
  b: BindingNode[]
}

export function assertNameNotDefined<T>(
  name: T,
  contextStack: ContextStack,
  builtin: Builtin,
  debugInfo?: DebugInfo,
): asserts name is T {
  if (typeof name !== `string`) {
    return
  }
  if (builtin.specialExpressions[name]) {
    throw new LitsError(`Cannot define variable ${name}, it's a special expression.`, debugInfo)
  }

  if (builtin.normalExpressions[name]) {
    throw new LitsError(`Cannot define variable ${name}, it's a builtin function.`, debugInfo)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((reservedNamesRecord as any)[name]) {
    throw new LitsError(`Cannot define variable ${name}, it's a reserved name.`, debugInfo)
  }

  if (contextStack.globalContext[name]) {
    throw new LitsError(`Name already defined "${name}".`, debugInfo)
  }
}
