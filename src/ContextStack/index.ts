import { DataType } from '../analyze/dataTypes/DataType'
import { Any, Arr, Obj } from '../interface'
import { LitsParams } from '../Lits/interface'
import { AstNode } from '../parser/interface'
import { DebugInfo } from '../tokenizer/interface'
import { toAny } from '../utils'
import { Context } from './interface'

export type EvaluateAstNode = (node: AstNode, contextStack: ContextStack) => Any
export type ExecuteFunction = (fn: Any, params: Arr, contextStack: ContextStack, debugInfo?: DebugInfo) => Any

export function createContextFromValues(values?: Obj): Context {
  if (!values) {
    return {}
  }
  return Object.entries(values).reduce((context: Context, [key, value]) => {
    context[key] = { value: toAny(value) }
    return context
  }, {})
}

export class ContextStack<T extends Any | DataType = Any> {
  public static create<T extends Any | DataType = Any>(contexts: Context<T>[] = []): ContextStack<T> {
    if (contexts.length === 0) {
      contexts.push({})
    }
    return new ContextStack(contexts, 0)
  }

  public static createFromParams(params: LitsParams): ContextStack {
    const globalContext: Context = params.globalContext ?? {}
    Object.assign(globalContext, createContextFromValues(params.globals))
    const contextStack = ContextStack.create([globalContext, ...(params.contexts ?? [])])
    return contextStack
  }

  public stack: Context<T>[]
  public globalContext: Context<T>
  public numberOfImportedContexts: number
  private constructor(contexts: Context<T>[], globalContextIndex: number) {
    this.stack = contexts
    this.numberOfImportedContexts = contexts.length - (globalContextIndex + 1)
    this.globalContext = contexts[globalContextIndex] as Context<T>
  }

  public withContext(context: Context<T>): ContextStack<T> {
    return new ContextStack([context, ...this.stack], this.stack.length - this.numberOfImportedContexts)
  }
}
