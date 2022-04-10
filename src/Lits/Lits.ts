import { LitsFunction } from '..'
import { createContextStack, evaluate } from '../evaluator'
import { Context, ContextStack } from '../evaluator/interface'
import { Any, Obj } from '../interface'
import { parse } from '../parser'
import { Ast } from '../parser/interface'
import { runTest, TestResult } from '../testFramework'
import { tokenize } from '../tokenizer'
import { Token } from '../tokenizer/interface'
import { createContextFromValues } from '../utils'
import { Cache } from './Cache'

export type LitsParams = {
  contexts?: Context[]
  globals?: Obj
  globalContext?: Context
}

type LitsConfig = {
  astCacheSize?: number
  debug?: boolean
}

type RunTestParams = {
  test: string
  program: string
  testParams?: LitsParams
  programParams?: LitsParams
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

  public run(program: string, params?: LitsParams): unknown {
    const ast = this.generateAst(program)
    const result = this.evaluate(ast, params)
    return result
  }

  public runTest({ test, program, testParams = {}, programParams = {} }: RunTestParams): TestResult {
    return runTest(test, program, testParams, programParams, () => new Lits({ debug: true }))
  }

  public context(program: string, params: LitsParams = {}): Context {
    const contextStack = createContextStackFromParams(params)
    const ast = this.generateAst(program)
    evaluate(ast, contextStack)
    return contextStack.globalContext
  }

  public tokenize(program: string): Token[] {
    return tokenize(program, this.debug)
  }

  public parse(tokens: Token[]): Ast {
    return parse(tokens)
  }

  private evaluate(ast: Ast, params?: LitsParams): Any {
    const contextStack = createContextStackFromParams(params)
    return evaluate(ast, contextStack)
  }

  public apply(fn: LitsFunction, fnParams: unknown[], params?: LitsParams): Any {
    const fnName = `FN_2eb7b316-471c-5bfa-90cb-d3dfd9164a59`
    const paramsString: string = fnParams
      .map((_, index) => {
        return `${fnName}_${index}`
      })
      .join(` `)
    const program = `(${fnName} ${paramsString})`
    const ast = this.generateAst(program)

    const globals: Obj = fnParams.reduce(
      (result: Obj, param, index) => {
        result[`${fnName}_${index}`] = param
        return result
      },
      { [fnName]: fn },
    )

    params = params ?? {}
    params.globals = { ...params.globals, ...globals }

    return this.evaluate(ast, params)
  }

  private generateAst(program: string): Ast {
    if (this.astCache) {
      const cachedAst = this.astCache.get(program)
      if (cachedAst) {
        return cachedAst
      }
    }
    const tokens: Token[] = this.tokenize(program)
    const ast: Ast = this.parse(tokens)
    this.astCache?.set(program, ast)
    return ast
  }
}

function createContextStackFromParams(params?: LitsParams): ContextStack {
  const globalContext: Context = params?.globalContext ?? {}
  Object.assign(globalContext, createContextFromValues(params?.globals))
  const contextStack = createContextStack([globalContext, ...(params?.contexts ?? [])])
  return contextStack
}
