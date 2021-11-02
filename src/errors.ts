/* istanbul ignore file */

import { Arr } from './interface'
import { SourceCodeInfo } from './tokenizer/interface'

export class RecurSignal extends Error {
  public params: Arr
  constructor(params: Arr) {
    super(`recur, params: ${params}`)
    Object.setPrototypeOf(this, RecurSignal.prototype)
    this.name = `RecurSignal`
    this.params = params
  }
}

export class LitsError extends Error {
  public line: number | null
  public column: number | null
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(`${message} ${sourceCodeInfo}`)
    this.line = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.line
    this.column = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.column
    Object.setPrototypeOf(this, LitsError.prototype)
    this.name = `LitsError`
  }
}

export class NotAFunctionError extends Error {
  public line: number | null
  public column: number | null
  constructor(fn: unknown, sourceCodeInfo: SourceCodeInfo) {
    super(`Expected function, got ${fn} ${sourceCodeInfo}`)
    this.line = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.line
    this.column = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.column
    Object.setPrototypeOf(this, NotAFunctionError.prototype)
    this.name = `NotAFunctionError`
  }
}

export class UserDefinedError extends Error {
  public line: number | null
  public column: number | null
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(`${message} ${sourceCodeInfo}`)
    this.line = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.line
    this.column = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.column
    Object.setPrototypeOf(this, UserDefinedError.prototype)
    this.name = `UserDefinedError`
  }
}

export class AssertionError extends Error {
  public line: number | null
  public column: number | null
  constructor(message: string, sourceCodeInfo: SourceCodeInfo) {
    super(`${message} ${sourceCodeInfo}`)
    this.line = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.line
    this.column = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.column
    Object.setPrototypeOf(this, AssertionError.prototype)
    this.name = `AssertionError`
  }
}

export class UndefinedSymbolError extends Error {
  public line: number | null
  public column: number | null
  constructor(symbolName: string, sourceCodeInfo: SourceCodeInfo) {
    super(`Undefined symbol '${symbolName}' ${sourceCodeInfo}`)
    this.line = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.line
    this.column = sourceCodeInfo === `EOF` ? null : sourceCodeInfo.column
    Object.setPrototypeOf(this, UndefinedSymbolError.prototype)
    this.name = `UndefinedSymbolError`
  }
}
