import type { NormalExpressionNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { unparseMultilineParams, unparseParams } from './unparseParams'
import { applyMetaTokens, assertNotOverflown, ensureNewlineSeparator } from './utils'

export function unparseArrayLitteral2(node: NormalExpressionNode, options: UnparseOptions): string {
  const { lineLength } = options
  let result = applyMetaTokens('[', node.tkn?.metaTokens, options.inline())

  const firstElement = options.unparse(node.p[0]!, options)
  const params = node.p.slice(1)

  result += firstElement

  const flatParams = params.map(param => options.unparse(param, options.inline())).join(' ')

  if (!flatParams.includes('\n') && 1 + flatParams.length < lineLength)
    return `${result} ${flatParams}${applyMetaTokens(']', node.endBracketToken?.metaTokens, options.inline())}`

  const indentedParams = params.map(param => options.unparse(param, options.inline(false).inc()))
    .reduce<string>((acc, param) => {
      if (param === null)
        throw new Error('Too long')
      if ((!acc || !acc.endsWith('\n')) && !param.startsWith('\n'))
        return `${acc}\n${param}`

      return `${acc}${param}`
    }, '')
  return `${result}${indentedParams}${applyMetaTokens(']', node.endBracketToken?.metaTokens, options.inline())}`
}

export function unparseArrayLitteral(node: NormalExpressionNode, options: UnparseOptions): string {
  const startBracket = applyMetaTokens('[', node.tkn?.metaTokens, options)
  const endBracket = applyMetaTokens(']', node.endBracketToken?.metaTokens, options.inline())

  const unparsedFirstElement = options.unparse(node.p[0]!, options.inc().inline())
  const params = node.p.slice(1)

  const prefix = startBracket + unparsedFirstElement

  // 1. Try to unparse the parameters
  try {
    const unparsedParams = unparseParams(params, options.inline().lock())
    if (!unparsedParams.includes('\n'))
      return assertNotOverflown(options.lineLength, `${prefix} ${unparsedParams}${endBracket}`)
  }
  catch (error) {
    // If locked, we do not try anything else
    if (options.locked)
      throw error
  }

  // 2. Try to unparse the parameters in multiple lines
  // e.g. [1 2 3 4 5]
  // ==>  [
  //       1
  //       2
  //       3
  //       4
  //       5]
  return `${ensureNewlineSeparator(
    prefix,
    unparseMultilineParams(params, options.inline(false).inc()),
  )}${endBracket}`
}
