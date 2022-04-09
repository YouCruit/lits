import { Arr } from './interface'
import { SourceCodeInfo } from './tokenizer/interface'
import { valueToString } from './utils/helpers'

export class RecurSignal extends Error {
  public params: Arr
  constructor(params: Arr) {
    super(`recur, params: ${params}`)
    Object.setPrototypeOf(this, RecurSignal.prototype)
    this.name = `RecurSignal`
    this.params = params
  }
}

export abstract class AbstractLitsError extends Error {
  public line: number | null
  public column: number | null
  public shortMessage: string
  public sourceCodeLine: string | null
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(`${message}${sourceCodeInfo ? ` ${sourceCodeInfo}` : ``}`)
    this.shortMessage = message
    this.line = sourceCodeInfo === `EOF` || sourceCodeInfo === null ? null : sourceCodeInfo.line
    this.column = sourceCodeInfo === `EOF` || sourceCodeInfo === null ? null : sourceCodeInfo.column
    this.sourceCodeLine = sourceCodeInfo === `EOF` || sourceCodeInfo === null ? null : sourceCodeInfo.sourceCodeLine
    Object.setPrototypeOf(this, AbstractLitsError.prototype)
    this.name = `AbstractLitsError`
  }
}

export class LitsError extends AbstractLitsError {
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(message, sourceCodeInfo)
    Object.setPrototypeOf(this, LitsError.prototype)
    this.name = `LitsError`
  }
}

export class NotAFunctionError extends AbstractLitsError {
  constructor(fn: unknown, sourceCodeInfo: SourceCodeInfo) {
    const message = `Expected function, got ${valueToString(fn)}.`
    super(message, sourceCodeInfo)
    Object.setPrototypeOf(this, NotAFunctionError.prototype)
    this.name = `NotAFunctionError`
  }
}

export class UserDefinedError extends AbstractLitsError {
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(message, sourceCodeInfo)
    Object.setPrototypeOf(this, UserDefinedError.prototype)
    this.name = `UserDefinedError`
  }
}

export class AssertionError extends AbstractLitsError {
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(message, sourceCodeInfo)
    Object.setPrototypeOf(this, AssertionError.prototype)
    this.name = `AssertionError`
  }
}

export class UndefinedSymbolError extends AbstractLitsError {
  constructor(symbolName: string, sourceCodeInfo: SourceCodeInfo) {
    const message = `Undefined symbol '${symbolName}'.`
    super(message, sourceCodeInfo)
    Object.setPrototypeOf(this, UndefinedSymbolError.prototype)
    this.name = `UndefinedSymbolError`
  }
}
