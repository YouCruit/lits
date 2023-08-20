import { NameNode, BuiltinFunction, FunctionType, isBuiltinFunction } from '../parser/interface'
import { builtin } from '../builtin'
import { toAny } from '../utils'
import { Context, LookUpResult, isContextEntry } from './interface'
import { Any } from '../interface'
import { UndefinedSymbolError } from '../errors'
import { asValue, isLazyValue } from '../utils/assertion'
import type { LazyValue } from '../Lits/Lits'
import { FUNCTION_SYMBOL } from '../utils/symbols'
import { contextToString } from '.'

export class ContextStack {
  private contexts: Context[]
  public globalContext: Context
  private values?: Record<string, unknown>
  private lazyValues?: Record<string, LazyValue>
  constructor({
    contexts,
    values: hostValues,
    lazyValues: lazyHostValues,
  }: {
    contexts: Context[]
    values?: Record<string, unknown>
    lazyValues?: Record<string, LazyValue>
  }) {
    this.contexts = contexts
    this.globalContext = asValue(contexts[0])
    this.values = hostValues
    this.lazyValues = lazyHostValues
  }

  public toString() {
    return this.contexts.reduce((result, context, index) => {
      return `${result}Context ${index}${
        index === this.contexts.length - 1 ? ` - Global context` : ``
      }\n${contextToString(context)}\n`
    }, ``)
  }

  public withContext(context: Context): ContextStack {
    const globalContext = this.globalContext
    const contextStack = new ContextStack({
      contexts: [context, ...this.contexts],
      values: this.values,
      lazyValues: this.lazyValues,
    })
    contextStack.globalContext = globalContext
    return contextStack
  }

  public getValue(name: string): unknown {
    for (const context of this.contexts) {
      const contextEntry = context[name]
      if (contextEntry) {
        return contextEntry.value
      }
    }
    const lazyHostValue = this.lazyValues?.[name]
    if (lazyHostValue) {
      return lazyHostValue.read()
    }

    return this.values?.[name]
  }

  public lookUp(node: NameNode): LookUpResult {
    const value = node.v
    const debugInfo = node.tkn?.d

    for (const context of this.contexts) {
      const variable = context[value]
      if (variable) {
        return variable
      }
    }
    const lazyHostValue = this.lazyValues?.[value]
    if (lazyHostValue !== undefined) {
      return {
        value: toAny(lazyHostValue.read()),
      }
    }
    const hostValue = this.values?.[value]
    if (hostValue !== undefined) {
      return {
        value: toAny(hostValue),
      }
    }
    if (builtin.normalExpressions[value]) {
      const builtinFunction: BuiltinFunction = {
        [FUNCTION_SYMBOL]: true,
        d: debugInfo,
        t: FunctionType.Builtin,
        n: value,
      }
      return builtinFunction
    }

    if (builtin.specialExpressions[value]) {
      return `specialExpression`
    }

    return null
  }

  public evaluateName(node: NameNode): Any {
    const lookUpResult = this.lookUp(node)

    if (isContextEntry(lookUpResult)) {
      return lookUpResult.value
    } else if (isBuiltinFunction(lookUpResult)) {
      return lookUpResult
    } else if (isLazyValue(lookUpResult)) {
      return toAny(lookUpResult.read())
    }
    throw new UndefinedSymbolError(node.v, node.tkn?.d)
  }
}
