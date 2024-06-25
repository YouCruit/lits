import type { NormalExpressionNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { unparseMultilinePairwise, unparseMultilineParams, unparseSingleLinePairs } from './unparseParams'
import { applyMetaTokens } from './utils'

export function unparseBindings(node: NormalExpressionNode, options: UnparseOptions): string {
  const startBracket = applyMetaTokens('[', node.debug?.token.metaTokens, options)

  // If no parameters, return empty array literal
  if (node.p.length === 0) {
    const endBracket = applyMetaTokens(']', node.debug?.lastToken?.metaTokens, options.inline())
    return `${startBracket}${endBracket}`
  }

  // const unparsedFirstElement = options.unparse(node.p[0]!, options.inc().inline())
  const params = node.p

  const prefix = startBracket

  // 1. Try to unparse the bindings as one line
  try {
    const unparsedParams = unparseSingleLinePairs(params, options.inline().lock())
    const endBracket = applyMetaTokens(']', node.debug?.lastToken?.metaTokens, options.inline())
    if (!unparsedParams.includes('\n')) {
      const result = `${prefix}${unparsedParams}${endBracket}`
      return options.assertNotOverflown(result)
    }
  }
  catch (error) {
    // If locked, we do not try anything else
    if (options.locked)
      throw error
  }

  // 2. Try to unparse the bindings pairwise on multiple lines
  // e.g. [1 2 3 4]
  // ==>  [1 2
  //       3 4]
  try {
    const endBracket = applyMetaTokens(']', node.debug?.lastToken?.metaTokens, options.inline())
    const result = prefix + unparseMultilinePairwise(params, options.inline().inc()) + endBracket
    return options.assertNotOverflown(result)
  }
  catch {
    // 2. Unparse the parameters on multiple lines
    // e.g. [1 2 3 4]
    // ==>  [1
    //       2,
    //       3
    //       4]
    const unparsedParams = unparseMultilineParams(params, options.inline().inc())
    const endBracket = unparsedParams.endsWith('\n')
      ? applyMetaTokens(']', node.debug?.lastToken?.metaTokens, options.noInline())
      : applyMetaTokens(']', node.debug?.lastToken?.metaTokens, options.inline())

    return prefix + unparseMultilineParams(params, options.inline().inc()) + endBracket
  }
}
