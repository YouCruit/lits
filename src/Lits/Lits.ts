import { analyzeAst } from '../analyze'
import type { AnalyzeResult } from '../analyze/interface'
import { builtin, normalExpressionKeys, specialExpressionKeys } from '../builtin'
import { FunctionType } from '../constants/constants'
import { evaluate } from '../evaluator'
import { ContextStack } from '../evaluator/ContextStack'
import type { Context } from '../evaluator/interface'
import type { Any, Obj } from '../interface'
import { parse } from '../parser'
import type { LitsFunction } from '../parser/interface'
import { type Ast, type NativeJsFunction } from '../parser/interface'
import { tokenize } from '../tokenizer'
import type { Token } from '../tokenizer/interface'
import { Cache } from './Cache'

export type LocationGetter = (line: number, col: number) => string

export type LitsRuntimeInfo = {
  astCache: Cache | null
  astCacheSize: number | null
  debug: boolean
}

export type LazyValue = {
  read: () => unknown
  [key: string]: unknown
}

export type JsFunction = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...args: any[]) => unknown
  [key: string]: unknown
}

export type LitsParams = {
  contexts?: Context[]
  values?: Record<string, unknown>
  lazyValues?: Record<string, LazyValue>
  jsFunctions?: Record<string, JsFunction>
  getLocation?: LocationGetter
}

type LitsConfig = {
  initialCache?: Record<string, Ast>
  astCacheSize?: number | null
  debug?: boolean
}

export class Lits {
  private astCache: Cache | null
  private astCacheSize: number | null
  private debug: boolean

  constructor(config: LitsConfig = {}) {
    this.debug = config.debug ?? false
    this.astCacheSize = config.astCacheSize ?? null
    if (this.astCacheSize) {
      this.astCache = new Cache(this.astCacheSize)
      const initialCache = config.initialCache ?? {}
      for (const cacheEntry of Object.keys(initialCache)) {
        this.astCache.set(cacheEntry, initialCache[cacheEntry] as Ast)
      }
    } else {
      this.astCache = null
    }
  }

  public getRuntimeInfo(): LitsRuntimeInfo {
    return {
      astCacheSize: this.astCacheSize,
      astCache: this.astCache,
      debug: this.debug,
    }
  }

  public run(program: string, params: LitsParams = {}): unknown {
    const ast = this.generateAst(program, params.getLocation)
    const result = this.evaluate(ast, params)
    return result
  }

  public context(program: string, params: LitsParams = {}): Context {
    const contextStack = createContextStack(params)
    const ast = this.generateAst(program, params.getLocation)
    evaluate(ast, contextStack)
    return contextStack.globalContext
  }

  public analyze(program: string): AnalyzeResult {
    const params: LitsParams = {}
    const contextStack = createContextStack(params)
    const ast = this.generateAst(program, params.getLocation)

    return analyzeAst(ast.b, contextStack, builtin)
  }

  public tokenize(program: string, getLocation?: LocationGetter): Token[] {
    return tokenize(program, { debug: this.debug, getLocation })
  }

  public parse(tokens: Token[]): Ast {
    return parse(tokens)
  }

  private evaluate(ast: Ast, params: LitsParams): Any {
    const contextStack = createContextStack(params)
    return evaluate(ast, contextStack)
  }

  public apply(fn: LitsFunction, fnParams: unknown[], params: LitsParams = {}): Any {
    const fnName = `FN_2eb7b316-471c-5bfa-90cb-d3dfd9164a59`
    const paramsString: string = fnParams
      .map((_, index) => {
        return `${fnName}_${index}`
      })
      .join(` `)
    const program = `(${fnName} ${paramsString})`
    const ast = this.generateAst(program, params.getLocation)

    const hostValues: Obj = fnParams.reduce(
      (result: Obj, param, index) => {
        result[`${fnName}_${index}`] = param
        return result
      },
      { [fnName]: fn },
    )

    params.values = { ...params.values, ...hostValues }

    return this.evaluate(ast, params)
  }

  private generateAst(untrimmedProgram: string, getLocation: LocationGetter | undefined): Ast {
    const program = untrimmedProgram.trim()

    if (this.astCache) {
      const cachedAst = this.astCache.get(program)
      if (cachedAst) {
        return cachedAst
      }
    }
    const tokens: Token[] = this.tokenize(program, getLocation)
    const ast: Ast = this.parse(tokens)
    this.astCache?.set(program, ast)
    return ast
  }
}

export function createContextStack(params: LitsParams = {}): ContextStack {
  // Insert an empty context (globalContext), before provided contexts
  // Contexts are checked from left to right
  const contexts = params.contexts ? [{}, ...params.contexts] : [{}]
  const contextStack = new ContextStack({
    contexts,
    values: params.values,
    lazyValues: params.lazyValues,
    nativeJsFunctions:
      params.jsFunctions &&
      Object.entries(params.jsFunctions).reduce((acc: Record<string, NativeJsFunction>, [name, jsFunction]) => {
        if (specialExpressionKeys.includes(name)) {
          // eslint-disable-next-line no-console
          console.warn(`Cannot shadow special expression "${name}", ignoring.`)
          return acc
        }
        if (normalExpressionKeys.includes(name)) {
          // eslint-disable-next-line no-console
          console.warn(`Cannot shadow builtin function "${name}", ignoring.`)
          return acc
        }
        acc[name] = {
          t: FunctionType.NativeJsFunction,
          f: jsFunction,
          n: name,
          λ: true,
        }
        return acc
      }, {}),
  })
  return contextStack
}
