import { Arr } from './interface'
import { DebugInfo } from './tokenizer/interface'
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
  public debugInfo: DebugInfo
  public shortMessage: string
  constructor(message: string | Error, debugInfo: DebugInfo) {
    if (message instanceof Error) {
      message = `${message.name}${message.message ? `: ${message.message}` : ``}`
    }
    super(`${message}${debugInfo ? `\n${debugInfo}` : ``}`)
    this.shortMessage = message
    this.debugInfo = debugInfo
    Object.setPrototypeOf(this, AbstractLitsError.prototype)
    this.name = `AbstractLitsError`
  }
}

export class LitsError extends AbstractLitsError {
  constructor(message: string | Error, debugInfo: DebugInfo) {
    super(message, debugInfo)
    Object.setPrototypeOf(this, LitsError.prototype)
    this.name = `LitsError`
  }
}

export class NotAFunctionError extends AbstractLitsError {
  constructor(fn: unknown, debugInfo: DebugInfo) {
    const message = `Expected function, got ${valueToString(fn)}.`
    super(message, debugInfo)
    Object.setPrototypeOf(this, NotAFunctionError.prototype)
    this.name = `NotAFunctionError`
  }
}

export class UserDefinedError extends AbstractLitsError {
  constructor(message: string | Error, debugInfo: DebugInfo) {
    super(message, debugInfo)
    Object.setPrototypeOf(this, UserDefinedError.prototype)
    this.name = `UserDefinedError`
  }
}

export class AssertionError extends AbstractLitsError {
  constructor(message: string | Error, debugInfo: DebugInfo) {
    super(message, debugInfo)
    Object.setPrototypeOf(this, AssertionError.prototype)
    this.name = `AssertionError`
  }
}

export class UndefinedSymbolError extends AbstractLitsError {
  constructor(symbolName: string, debugInfo: DebugInfo) {
    const message = `Undefined symbol '${symbolName}'.`
    super(message, debugInfo)
    Object.setPrototypeOf(this, UndefinedSymbolError.prototype)
    this.name = `UndefinedSymbolError`
  }
}
