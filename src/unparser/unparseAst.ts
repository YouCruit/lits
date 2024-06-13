import { AstNodeType, TokenType } from '../constants/constants'
import type { Ast, AstNode, NormalExpressionNode } from '../parser/interface'
import { isNewLineToken } from '../tokenizer'
import type { MetaToken, MetaTokens } from '../tokenizer/interface'

class UnparseParams {
  constructor(
    public readonly lineLength: number,
    public readonly col = 0,
    public readonly inline = false,
  ) {}

  public inc(count = 1) {
    return new UnparseParams(this.lineLength, this.col + count, this.inline)
  }

  public inlined(inline = true) {
    return new UnparseParams(this.lineLength, this.col, inline)
  }
}

export function unparseAst(ast: Ast, lineLength?: number): string {
  const unparseParams = new UnparseParams(lineLength || Number.MAX_SAFE_INTEGER)
  const result = ast.b.map(node => unparseNode(node, unparseParams)).join('\n')
  return result.endsWith('\n') ? result : `${result}\n`
}

function unparseNode(node: AstNode, options: UnparseParams): string {
  const col = options.inline ? 0 : options.col
  switch (node.t) {
    case AstNodeType.String:
      return node.tkn?.o?.s
        ? applyMetaTokens(`:${node.v}`, node.tkn.metaTokens, col) // Keyword
        : applyMetaTokens(`"${node.v}"`, node.tkn?.metaTokens, col)
    case AstNodeType.Number:
    case AstNodeType.Name:
    case AstNodeType.Modifier:
    case AstNodeType.ReservedName:
      return applyMetaTokens(node.v, node.tkn?.metaTokens, col)
    case AstNodeType.Comment:
      return `${applyMetaTokens(node.v, node.tkn?.metaTokens, col)}\n`
    case AstNodeType.NormalExpression:
      return unparseNormalExpressionNode(node, options)
    case AstNodeType.SpecialExpression:
      throw new Error('Not implemented')
  }
}

function applyMetaTokens(value: string | number, metaTokens: MetaTokens | undefined, col: number): string {
  if (!metaTokens) {
    return `${value}`
  }
  else {
    return `${
      metaTokensToString(metaTokens?.leadingMetaTokens, col)
    }${
      ' '.repeat(col) + value
    }${
      metaTokens?.inlineCommentToken ? ` ${metaTokens.inlineCommentToken.v}\n` : ''
    }`
  }
}

function metaTokensToString(metaTokens?: MetaToken[] | MetaToken | null, col = 0): string {
  return metaTokens
    ? (Array.isArray(metaTokens) ? metaTokens : [metaTokens]).map(metaToken =>
        isNewLineToken(metaToken) ? metaToken.v : `${' '.repeat(col) + metaToken.v}\n`,
      ).join('')
    : ''
}

function unparseNormalExpressionNode(node: NormalExpressionNode, options: UnparseParams): string {
  if (node.tkn?.t === TokenType.Bracket && node.tkn.v === '[')
    return unparseArrayLitteral(node, options)

  const startBracket = applyMetaTokens('(', node.tkn?.metaTokens, options.inline ? 0 : options.col)
  const endBracket = applyMetaTokens(')', node.endBracketToken?.metaTokens, 0)

  const name = node.n
    ? applyMetaTokens(node.n, node.nameToken?.metaTokens, 0)
    : unparseNode(node.p[0]!, options.inc().inlined())
  const params = node.n ? node.p : node.p.slice(1)

  const intro = startBracket + name

  const flatParams = unparseFlatParams(params, intro.length + 1 + endBracket.length, options.inlined())
  if (flatParams !== null)
    return `${intro} ${flatParams}${endBracket}`

  let indentedParams = params.map(param => unparseNode(param, options.inc()))
    .reduce<string>((acc, param) => {
      if (acc && !acc.endsWith('\n') && !param.startsWith('\n'))
        return `${acc}\n${param}`
      return `${acc}${param}`
    }, '')
  indentedParams = intro.endsWith('\n') || indentedParams.startsWith('\n') ? indentedParams : `\n${indentedParams}`
  return `${intro}${indentedParams}${endBracket}`
}

function unparseFlatParams(params: AstNode[], startLegth: number, options: UnparseParams): string | null {
  try {
    return params.reduce<string>((acc, param) => {
      const unparsedParam = unparseNode(param, options.inlined())

      acc = `${acc ? `${acc} ` : ''}${unparsedParam}`
      if (acc.includes('\n') || startLegth + acc.length > options.lineLength)
        throw new Error('Too long')

      return acc
    }, '')
  }
  catch {
    return null
  }
}

function unparseArrayLitteral(node: NormalExpressionNode, options: UnparseParams): string {
  const { lineLength } = options
  let result = applyMetaTokens('[', node.tkn?.metaTokens, 0)

  const firstElement = unparseNode(node.p[0]!, options)
  const params = node.p.slice(1)

  result += firstElement

  const flatParams = params.map(param => unparseNode(param, options.inlined())).join(' ')

  if (!flatParams.includes('\n') && 1 + flatParams.length < lineLength)
    return `${result} ${flatParams}${applyMetaTokens(']', node.endBracketToken?.metaTokens, 0)}`

  const indentedParams = params.map(param => unparseNode(param, options.inlined(false).inc()))
    .reduce<string>((acc, param) => {
      if ((!acc || !acc.endsWith('\n')) && !param.startsWith('\n'))
        return `${acc}\n${param}`

      return `${acc}${param}`
    }, '')
  return `${result}${indentedParams}${applyMetaTokens(']', node.endBracketToken?.metaTokens, 0)}`
}
