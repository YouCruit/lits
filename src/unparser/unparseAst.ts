import { AstNodeType, TokenType } from '../constants/constants'
import type { Ast, AstNode, NormalExpressionNode } from '../parser/interface'
import { isNewLineToken } from '../tokenizer'
import type { MetaToken, MetaTokens } from '../tokenizer/interface'

class UnparseOptions {
  constructor(
    public readonly lineLength: number,
    public readonly col = 0,
    public readonly inlined = false,
    public readonly locked = false,
  ) {}

  public inc(count = 1) {
    return new UnparseOptions(this.lineLength, this.col + count, this.inlined, this.locked)
  }

  public inline(inline = true) {
    return new UnparseOptions(this.lineLength, this.col, inline, this.locked)
  }

  public lock() {
    return new UnparseOptions(this.lineLength, this.col, this.inlined, true)
  }

  public indent(): string {
    return ' '.repeat(this.col)
  }
}

export function unparseAst(ast: Ast, lineLength?: number): string {
  const options = new UnparseOptions(lineLength || Number.MAX_SAFE_INTEGER)
  const result = ast.b.map((node) => {
    const unparsedNode = unparseNode(node, options)
    if (unparsedNode === null)
      throw new Error('Line length exceeded')
    return unparsedNode
  }).join('\n')
  return result.endsWith('\n') ? result : `${result}\n`
}

function unparseNode(node: AstNode, options: UnparseOptions): string | null {
  switch (node.t) {
    case AstNodeType.String:
      return node.tkn?.o?.s
        ? applyMetaTokens(`:${node.v}`, node.tkn.metaTokens, options) // Keyword
        : applyMetaTokens(`"${node.v}"`, node.tkn?.metaTokens, options)
    case AstNodeType.Number:
    case AstNodeType.Name:
    case AstNodeType.Modifier:
    case AstNodeType.ReservedName:
      return applyMetaTokens(node.v, node.tkn?.metaTokens, options)
    case AstNodeType.Comment:
      return `${applyMetaTokens(node.v, node.tkn?.metaTokens, options)}\n`
    case AstNodeType.NormalExpression: {
      return unparseNormalExpressionNode(node, options)
    }
    case AstNodeType.SpecialExpression:
      throw new Error('Not implemented')
  }
}

function applyMetaTokens(value: string | number, metaTokens: MetaTokens | undefined, options: UnparseOptions): string {
  if (!metaTokens) {
    return `${!options.inlined ? '' : options.indent()}${value}`
  }
  else {
    const result = `${
      metaTokensToString(metaTokens?.leadingMetaTokens)
    }${
      value
    }${
      metaTokens?.inlineCommentToken ? ` ${metaTokens.inlineCommentToken.v}\n` : ''
    }`
    return result.split('\n').map((line, index) => {
      return `${line && (!options.inlined || index > 0) ? options.indent() : ''}${line}`
    }).join('\n')
  }
}

function metaTokensToString(metaTokens?: MetaToken[] | null): string {
  return metaTokens
    ? metaTokens.map(metaToken =>
      isNewLineToken(metaToken) ? metaToken.v : `${metaToken.v}\n`,
    ).join('')
    : ''
}

function unparseNormalExpressionNode(node: NormalExpressionNode, options: UnparseOptions): string | null {
  if (node.tkn?.t === TokenType.Bracket && node.tkn.v === '[')
    return unparseArrayLitteral(node, options)

  const startBracket = applyMetaTokens('(', node.tkn?.metaTokens, options)
  const endBracket = applyMetaTokens(')', node.endBracketToken?.metaTokens, options.inline())

  const name = node.n
    ? applyMetaTokens(node.n, node.nameToken?.metaTokens, options.inline())
    : unparseNode(node.p[0]!, options.inc().inline())

  if (name === null)
    return null

  const params = node.n ? node.p : node.p.slice(1)
  const intro = startBracket + name

  // 1. Try to unparse the parameters in a single line
  const flatParams = unparseFlatParams(params, options.inline().lock())
  if (flatParams && !flatParams.includes('\n')) {
    const flatResult = flatParams && assertNotOverflown(options.lineLength, `${intro} ${flatParams}${endBracket}`)
    if (flatResult !== null)
      return flatResult
  }

  // If locked, we do not try anything else
  if (options.locked)
    return null

  // 2. Try to unparse the parameters in multiple lines
  // e.g. (round 1 2 3 4 5)
  // ==>  (round 1
  //             2
  //             3
  //             4
  //             5)
  let indentedParams: string | null = null
  if (!name.includes('\n') && params.length > 0) {
    const innerOptions = options.inc(name.length + 2).lock()
    const firstParam = unparseNode(params[0]!, innerOptions.inline())
    // If the first parameter is multiline, fallback to option 3
    if (firstParam !== null && !firstParam.includes('\n')) {
      indentedParams = unparseParams(params.slice(1), innerOptions)
      const result = (indentedParams || null) && assertNotOverflown(
        innerOptions.lineLength,
        `${intro} ${firstParam}\n${indentedParams}${endBracket}`,
      )
      if (result !== null)
        return result
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
  indentedParams = unparseParams(params, options.inc())
  if (indentedParams !== null)
    return `${ensureNewlineSeparator(intro, indentedParams)}${endBracket}`

  return null
}

function unparseFlatParams(params: AstNode[], options: UnparseOptions): string | null {
  try {
    return params.reduce<string>((acc, param) => {
      const unparsedParam = unparseNode(param, options.inline())
      if (unparsedParam === null)
        throw new Error('Too long')

      return `${acc ? `${acc} ` : ''}${unparsedParam}`
    }, '')
  }
  catch {
    return null
  }
}

function unparseParams(params: AstNode[], options: UnparseOptions): string | null {
  try {
    return params.reduce<string>((acc, param, index) => {
      const unparsedParam = unparseNode(
        param,
        index === 0 && options.inlined
          ? options.inline()
          : options.inline(false),
      )
      if (unparsedParam === null)
        throw new Error('Too long')

      if (acc && !acc.endsWith('\n') && !unparsedParam.startsWith('\n'))
        return acc = `${acc}\n${unparsedParam}`
      return `${acc}${unparsedParam}`
    }, '')
  }
  catch {
    return null
  }
}

function unparseArrayLitteral(node: NormalExpressionNode, options: UnparseOptions): string | null {
  const { lineLength } = options
  let result = applyMetaTokens('[', node.tkn?.metaTokens, options.inline())

  const firstElement = unparseNode(node.p[0]!, options)
  const params = node.p.slice(1)

  result += firstElement

  const flatParams = params.map(param => unparseNode(param, options.inline())).join(' ')

  if (!flatParams.includes('\n') && 1 + flatParams.length < lineLength)
    return `${result} ${flatParams}${applyMetaTokens(']', node.endBracketToken?.metaTokens, options.inline())}`

  try {
    const indentedParams = params.map(param => unparseNode(param, options.inline(false).inc()))
      .reduce<string>((acc, param) => {
        if (param === null)
          throw new Error('Too long')
        if ((!acc || !acc.endsWith('\n')) && !param.startsWith('\n'))
          return `${acc}\n${param}`

        return `${acc}${param}`
      }, '')
    return `${result}${indentedParams}${applyMetaTokens(']', node.endBracketToken?.metaTokens, options.inline())}`
  }
  catch {
    return null
  }
}

function ensureNewlineSeparator(a: string, b: string): string {
  return a.endsWith('\n') || b.startsWith('\n') ? `${a}${b}` : `${a}\n${b}`
}

function assertNotOverflown(lineLength: number, value: string | null): string | null {
  if (value === null)
    return null
  return value.split('\n').every(line => line.length <= lineLength)
    ? value
    : null
}
