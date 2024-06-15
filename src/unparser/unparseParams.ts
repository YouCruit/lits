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
