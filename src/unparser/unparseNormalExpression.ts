import { TokenType } from '../constants/constants'
import type { NormalExpressionNode } from '../parser/interface'
import type { UnparseOptions } from './UnparseOptions'
import { unparseArrayLiteral } from './unparseArrayLiteral'
import { unparseObjectLiteral } from './unparseObjectLiteral'
import { unparseMultilineParams, unparseParams } from './unparseParams'
import { applyMetaTokens, ensureNewlineSeparator } from './utils'

export function unparseNormalExpressionNode(node: NormalExpressionNode, options: UnparseOptions): string {
  if (node.debug?.token.t === TokenType.Bracket && node.debug.token.v === '[')
    return unparseArrayLiteral(node, options)
  else if (node.debug?.token.t === TokenType.Bracket && node.debug.token.v === '{')
    return unparseObjectLiteral(node, options)

  const { startBracket, unparsedName, params, endBracket } = getInfo(node, options)
  const prefix = startBracket + unparsedName

  // If no parameters, return the expression with brackets
  if (params.length === 0)
    return `${prefix}${endBracket}`

  // 1. Try to unparse the parameters as a single line
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

  // 2. Try to unparse the parameters in multiple lines, first parameter on the same line
  // e.g. (round 1 2 3 4 5)
  // ==>  (round 1
  //             2
  //             3
  //             4
  //             5)
  if (!unparsedName.includes('\n')) {
    const newOptions = options.inc(unparsedName.length + 2).lock()
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
    unparseMultilineParams(params, options.noInline().inc()),
  )}${endBracket}`
}

function getInfo(node: NormalExpressionNode, options: UnparseOptions) {
  const startBracket = applyMetaTokens('(', node.debug?.token.metaTokens, options)
  const endBracket = applyMetaTokens(')', node.debug?.endBracketToken?.metaTokens, options.inline())

  // Unparse the name,
  // if expression node e.g. ("Albert" 2), first parameter is the name ("Albert")
  const unparsedName = node.n
    ? applyMetaTokens(node.n, node.debug?.nameToken?.metaTokens, options.inline())
    : options.unparse(node.p[0]!, options.inc().inline())

  const params = node.n ? node.p : node.p.slice(1)

  return { startBracket, params, unparsedName, endBracket }
}
