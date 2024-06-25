import type { NormalExpressionNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { unparseMultilinePairwise, unparseMultilineParams, unparseSingleLinePairs } from './unparseParams'
import { applyMetaTokens } from './utils'

export function unparseObjectLiteral(node: NormalExpressionNode, options: UnparseOptions): string {
  const startBracket = applyMetaTokens('{', node.debug?.token.metaTokens, options)
  const endBracket = applyMetaTokens('}', node.debug?.lastToken?.metaTokens, options.inline())

  // If no parameters, return empty object literal
  if (node.p.length === 0)
    return `${startBracket}${endBracket}`

  // const unparsedFirstElement = options.unparse(node.p[0]!, options.inc().inline())
  // If the first element is not multiline, try to unparse the object literal as one liner or multiline with pairs
  // if (!unparsedFirstElement.includes('\n')) {
  // const unparsedSecondElement
  //   = options.unparse(node.p[1]!, options.inc(unparsedFirstElement.length + 2).inline())
  const params = node.p

  // const firstPair = `${unparsedFirstElement} ${unparsedSecondElement}`
  const prefix = `${startBracket}`

  // if (params.length === 0) {
  //   try {
  //     return options.assertNotOverflown(`${pairPrefix}${endBracket}`)
  //   }
  //   catch { }
  // }
  // 1. Try to unparse the parameters
  // else if (!firstPair.includes('\n')) {
  try {
    const unparsedParams = unparseSingleLinePairs(params, options.inline().lock())

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
  // }

  // 2. Try to unparse the parameters pairwise on multiple lines
  // e.g. {:a 1 :b 2 :c 3 :d 4 :e 5}
  // ==>  {:a 1
  //       :b 2
  //       :c 3
  //       :d 4
  //       :e 5}
  try {
    return options.assertNotOverflown(prefix
      + unparseMultilinePairwise(params, options.inline().inc()) + endBracket)
  }
  catch {
  }

  // 3. Try to unparse the parameters in multiple lines
  // const prefix = `${startBracket}${unparsedFirstElement}`
  return prefix + unparseMultilineParams(node.p, options.inline().inc()) + endBracket
}
