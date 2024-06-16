import type { NormalExpressionNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { unparseMultilineParams, unparseParams } from './unparseParams'
import { applyMetaTokens, ensureNewlineSeparator } from './utils'

export function unparseArrayLiteral(node: NormalExpressionNode, options: UnparseOptions): string {
  const startBracket = applyMetaTokens('[', node.tkn?.metaTokens, options)
  const endBracket = applyMetaTokens(']', node.endBracketToken?.metaTokens, options.inline())

  // If no parameters, return empty array literal
  if (node.p.length === 0)
    return `${startBracket}${endBracket}`

  const unparsedFirstElement = options.unparse(node.p[0]!, options.inc().inline())
  const params = node.p.slice(1)

  const prefix = startBracket + unparsedFirstElement

  // 1. Try to unparse the parameters
  try {
    const unparsedParams = unparseParams(params, options.inline().lock())
    if (!unparsedParams.includes('\n'))
      return options.assertNotOverflown(`${prefix} ${unparsedParams}${endBracket}`)
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
    unparseMultilineParams(params, options.noInline().inc()),
  )}${endBracket}`
}
