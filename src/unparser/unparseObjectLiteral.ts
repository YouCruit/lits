import type { NormalExpressionNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { unparseMultilinePairs as unparseMultilineParamPairs, unparsePairs as unparseParamPairs } from './unparseParams'
import { applyMetaTokens, assertNotOverflown, ensureNewlineSeparator } from './utils'

export function unparseObjectLiteral(node: NormalExpressionNode, options: UnparseOptions): string {
  const startBracket = applyMetaTokens('{', node.tkn?.metaTokens, options)
  const endBracket = applyMetaTokens('}', node.endBracketToken?.metaTokens, options.inline())

  // If no parameters, return empty object literal
  if (node.p.length === 0)
    return `${startBracket}${endBracket}`

  const unparsedFirstElement = options.unparse(node.p[0]!, options.inc().inline())
  const unparsedSecondElement
    = options.unparse(node.p[1]!, options.inc(unparsedFirstElement.length + 2).inline())
  const params = node.p.slice(2)

  const prefix = `${startBracket}${unparsedFirstElement} ${unparsedSecondElement}`

  // 1. Try to unparse the parameters
  if (!prefix.includes('\n')) {
    try {
      const unparsedParams = unparseParamPairs(params, options.inline().lock())

      if (!unparsedParams.includes('\n')) {
        const result = `${prefix}, ${unparsedParams}${endBracket}`
        // TODO, can we have this inlined logic inside the assertNotOverflown function?
        // and possibly move that into the UnparseOptions class?
        return assertNotOverflown(options.lineLength - (options.inlined ? options.col : 0), result)
      }
    }
    catch (error) {
    // If locked, we do not try anything else
      if (options.locked)
        throw error
    }
  }

  // 2. Try to unparse the parameters in multiple lines
  // e.g. [1 2 3 4 5]
  // ==>  [1
  //       2
  //       3
  //       4
  //       5]
  return `${ensureNewlineSeparator(
    prefix,
    unparseMultilineParamPairs(params, options.inline(false).inc()),
  )}${endBracket}`
}
