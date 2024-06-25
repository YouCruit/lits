import type { LetNode } from '../../builtin/specialExpressions/let'
import { AstNodeType } from '../../constants/constants'
import type { AstNode, BindingNode, NormalExpressionNode } from '../../parser/interface'
import { unparseBindings } from '../unparseBindings'
import type { UnparseOptions } from '../UnparseOptions'
import { unparseParams } from '../unparseParams'
import { applyMetaTokens } from '../utils'

export function unparseLet(node: LetNode, options: UnparseOptions) {
  const startBracket = applyMetaTokens('(', node.debug?.token.metaTokens, options)
  const endBracket = applyMetaTokens(')', node.debug?.lastToken?.metaTokens, options.inline())
  const name = applyMetaTokens(node.n, node.debug?.nameToken?.metaTokens, options.inline())

  const letArray = node.debug ? node.debug.bindingArray : createLetArray(node.bs)

  const inc = name.includes('\n') ? 1 : name.length + 2
  const unparsedLetArray = unparseBindings(letArray, options.inc(inc).inline())

  const prefix = `${startBracket + name} ${unparsedLetArray}`
  const inline = !(name + unparsedLetArray).includes('\n')
  return unparseParams({
    params: node.p,
    options,
    prefix,
    inline,
    endBracket,
    indent: 2,
    noMultilineInline: true,
  })
}

function createLetArray(bindingNodes: BindingNode[]) {
  const params = bindingNodes.flatMap<AstNode>(binding => [
    {
      t: AstNodeType.Name,
      n: undefined,
      p: [],
      debug: undefined,
      v: binding.n,
    },
    binding.v,
  ])

  const node: NormalExpressionNode = {
    t: AstNodeType.NormalExpression,
    n: 'array',
    p: params,
    debug: undefined,
  }
  return node
}
