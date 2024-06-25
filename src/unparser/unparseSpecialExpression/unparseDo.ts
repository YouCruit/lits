import type { DoNode } from '../../builtin/specialExpressions/do'
import type { UnparseOptions } from '../UnparseOptions'
import { unparseParams } from '../unparseParams'
import { applyMetaTokens } from '../utils'

export function unparseDo(node: DoNode, options: UnparseOptions) {
  const startBracket = applyMetaTokens('(', node.debug?.token.metaTokens, options)
  const endBracket = applyMetaTokens(')', node.debug?.lastToken?.metaTokens, options.inline())
  const name = applyMetaTokens(node.n, node.debug?.nameToken?.metaTokens, options.inline())
  const prefix = startBracket + name

  return unparseParams({ params: node.p, options, prefix, name, endBracket, indent: 2 })
}
