// import { builtin } from '../builtin'
// import { assertNameNotDefined } from '../builtin/utils'
import { createContextStack, evaluate } from '../evaluator'
import { Context } from '../evaluator/interface'
import { Any, Obj } from '../interface'
import { parse } from '../parser'
import { Ast } from '../parser/interface'
import { tokenize } from '../tokenizer'
import { Token } from '../tokenizer/interface'
import { createContextFromValues } from '../utils'
import { Cache } from './Cache'

type LispishParams = {
  contexts?: Context[]
  values?: Obj
}

type LispishConfig = {
  astCacheSize?: number
}

export class Lispish {
  private astCache: Cache<Ast> | null

  constructor(config: LispishConfig = {}) {
    if (config.astCacheSize && config.astCacheSize > 0) {
      this.astCache = new Cache(config.astCacheSize)
    } else {
      this.astCache = null
    }
  }

  public run(program: string, params?: LispishParams): unknown {
    const ast = this.generateAst(program)
    const result = this.evaluate(ast, params)
    return result
  }

  public context(program: string, params?: LispishParams): Context {
    const context: Context = createContextFromValues(params?.values ?? {})
    const contextStack = createContextStack([context, ...(params?.contexts ?? [])])
    const ast = this.generateAst(program)
    evaluate(ast, contextStack)
    return contextStack.globalContext
  }

  private tokenize(program: string): Token[] {
    return tokenize(program)
  }

  private parse(tokens: Token[]): Ast {
    return parse(tokens)
  }

  private evaluate(ast: Ast, params: LispishParams = {}): Any {
    const globalContext = createContextFromValues(params.values)
    const contextStack = createContextStack([globalContext, ...(params.contexts ?? [])])
    return evaluate(ast, contextStack)
  }

  private generateAst(program: string) {
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
