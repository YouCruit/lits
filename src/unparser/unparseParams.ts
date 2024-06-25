import type { AstNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { ensureNewlineSeparator, ensureSpaceSeparator } from './utils'

export function unparseParams({
  params,
  options,
  prefix,
  name,
  endBracket,
  indent,
}: {
  params: AstNode[]
  prefix: string
  name: string
  endBracket: string
  options: UnparseOptions
  indent: number
}): string {
  // If no parameters, return the expression with brackets
  if (params.length === 0)
    return `${prefix}${endBracket}`

  // 1. Try to unparse the parameters as a single line
  try {
    const unparsedParams = unparseSingleLineParams(params, options.inline().lock())
    if (!unparsedParams.includes('\n'))
      return options.assertNotOverflown(`${prefix} ${unparsedParams}${endBracket}`)
  }
  catch (error) {
    // If locked, we do not try anything else
    if (options.locked)
      throw error
  }

  // 2. Try to unparse the parameters in multiple lines, first parameter on the same line
  // e.g. (round 1 2 3 4 5)
  // ==>  (round 1
  //             2
  //             3
  //             4
  //             5)
  if (!name.includes('\n')) {
    const newOptions = options.inc(name.length + 2).lock()
    try {
      const firstParam = options.unparse(params[0]!, newOptions.inline())
      // If the first parameter is multiline, fallback to option 3
      if (!firstParam.startsWith('\n')) {
        const indentedParams = unparseMultilineParams(params.slice(1), newOptions)
        return options.assertNotOverflown(
          `${prefix} ${ensureNewlineSeparator(firstParam, indentedParams)}${endBracket}`,
        )
      }
    }
    catch {
    // Try option 3
    }
  }

  // 3. Try to unparse the parameters in multiple lines
  // e.g. (round 1 2 3 4 5)
  // ==>  (round
  //       1
  //       2
  //       3
  //       4
  //       5)
  return `${ensureNewlineSeparator(
    prefix,
    unparseMultilineParams(params, options.noInline().inc(indent)),
  )}${endBracket}`
}

export function unparseSingleLineParams(params: AstNode[], options: UnparseOptions): string {
  return params.reduce<string>((acc, param) =>
    ensureSpaceSeparator(acc, options.unparse(param, options.inline())), '')
}

export function unparseMultilineParams(params: AstNode[], options: UnparseOptions): string {
  return params.reduce<string>((acc, param, index) => ensureNewlineSeparator(acc, options.unparse(
    param,
    index === 0 && options.inlined ? options.inline() : options.noInline(),
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
