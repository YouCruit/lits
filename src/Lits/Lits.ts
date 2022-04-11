import { LitsFunction } from '..'
import { createContextStack, evaluate } from '../evaluator'
import { Context, ContextStack } from '../evaluator/interface'
import { Any, Obj } from '../interface'
import { parse } from '../parser'
import { Ast } from '../parser/interface'
import { runTest, RunTestParams, TestResult } from '../testFramework'
import { tokenize } from '../tokenizer'
import { Token } from '../tokenizer/interface'
import { createContextFromValues } from '../utils'
import { Cache } from './Cache'

export type LitsParams = {
  contexts?: Context[]
  globals?: Obj
  globalContext?: Context
  filename?: string
}

type LitsConfig = {
  astCacheSize?: number
  debug?: boolean
}

export class Lits {
  private astCache: Cache<Ast> | null
  private debug: boolean

  constructor(config: LitsConfig = {}) {
    this.debug = config.debug ?? false
    if (config.astCacheSize && config.astCacheSize > 0) {
      this.astCache = new Cache(config.astCacheSize)
    } else {
      this.astCache = null
    }
  }

  public run(program: string, params: LitsParams = {}): unknown {
    const ast = this.generateAst(program, params.filename)
    const result = this.evaluate(ast, params)
    return result
  }

  public runTest(params: RunTestParams): TestResult {
    return runTest(params, () => new Lits({ debug: true }))
  }

  public context(program: string, params: LitsParams = {}): Context {
    const contextStack = createContextStackFromParams(params)
    const ast = this.generateAst(program, params.filename)
    evaluate(ast, contextStack)
    return contextStack.globalContext
  }

  public tokenize(program: string, filename?: string): Token[] {
    return tokenize(program, { debug: this.debug, filename })
  }

  public parse(tokens: Token[]): Ast {
    return parse(tokens)
  }

  private evaluate(ast: Ast, params: LitsParams): Any {
    const contextStack = createContextStackFromParams(params)
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
    const ast = this.generateAst(program, params.filename)

    const globals: Obj = fnParams.reduce(
      (result: Obj, param, index) => {
        result[`${fnName}_${index}`] = param
        return result
      },
      { [fnName]: fn },
    )

    params.globals = { ...params.globals, ...globals }

    return this.evaluate(ast, params)
  }

  private generateAst(program: string, filename: string | undefined): Ast {
    if (this.astCache) {
      const cachedAst = this.astCache.get(program)
      if (cachedAst) {
        return cachedAst
      }
    }
    const tokens: Token[] = this.tokenize(program, filename)
    const ast: Ast = this.parse(tokens)
    this.astCache?.set(program, ast)
    return ast
  }
}

function createContextStackFromParams(params: LitsParams): ContextStack {
  const globalContext: Context = params.globalContext ?? {}
  Object.assign(globalContext, createContextFromValues(params.globals))
  const contextStack = createContextStack([globalContext, ...(params.contexts ?? [])])
  return contextStack
}
