import type { AstNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { ensureNewlineSeparator, ensureSpaceSeparator } from './utils'

export function unparseParams(params: AstNode[], options: UnparseOptions): string {
  return params.reduce<string>((acc, param) =>
    ensureSpaceSeparator(acc, options.unparse(param, options.inline())), '')
}

export function unparseMultilineParams(params: AstNode[], options: UnparseOptions): string {
  return params.reduce<string>((acc, param, index) => ensureNewlineSeparator(acc, options.unparse(
    param,
    options.inline(index === 0 && options.inlined),
  )), '')
}

export function unparsePairs(params: AstNode[], options: UnparseOptions): string {
  return params.reduce<string>((acc, param, index) => {
    acc = (index > 0 && index % 2 === 0) ? `${acc},` : acc
    return ensureSpaceSeparator(acc, options.unparse(param, options.inc().inline()))
  }, '')
}

export function unparseMultilinePairs(params: AstNode[], options: UnparseOptions): string {
  let keyLength: number
  return params.reduce<string>((acc, param, index) => {
    if (index % 2 === 0) {
      let key = options.unparse(
        param,
        options.inline(),
      )
      keyLength = key.length
      key = index === 0 && options.inlined ? key : `${options.indent}${key}`
      return ensureNewlineSeparator(acc, key)
    }
    else {
      return ensureSpaceSeparator(acc, options.unparse(
        param,
        options.inline().inc(keyLength + 1),
      ))
    }
  }, '')
}
