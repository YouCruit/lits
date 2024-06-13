import { AstNodeType } from '../constants/constants'
import type { Ast, AstNode, NormalExpressionNode } from '../parser/interface'
import { isNewLineToken } from '../tokenizer'
import type { MetaToken, Token } from '../tokenizer/interface'

export function unparseAst(ast: Ast, maxLineLength?: number): string {
  const result = ast.b.map(node => unparseNode(node, 0, maxLineLength || Number.MAX_SAFE_INTEGER)).join('\n')
  return result.endsWith('\n') ? result : `${result}\n`
}

function unparseNode(node: AstNode, col: number, maxLineLength: number): string {
  switch (node.t) {
    case AstNodeType.Number:
    case AstNodeType.String:
    case AstNodeType.Name:
    case AstNodeType.Modifier:
    case AstNodeType.ReservedName:
      return applyMetaTokens(node.v, node.tkn, col)
    case AstNodeType.Comment:
      return `${applyMetaTokens(node.v, node.tkn, col)}\n`
    case AstNodeType.NormalExpression:
      return unparseNormalExpressionNode(node, col, maxLineLength)
    case AstNodeType.SpecialExpression:
      throw new Error('Not implemented')
  }
}

function applyMetaTokens(value: string | number, token: Token | undefined, col: number): string {
  if (!token) {
    return `${value}`
  }
  else {
    return `${
      metaTokensToString(token?.metaTokens?.leadingMetaTokens, col)
    }${
      ' '.repeat(col) + value
    }${
      token?.metaTokens?.inlineCommentToken ? ` ${token.metaTokens.inlineCommentToken.v}\n` : ''
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

function unparseNormalExpressionNode(node: NormalExpressionNode, col: number, maxLineLength: number): string {
  let result = applyMetaTokens('(', node.tkn, col)

  if (node.n) {
    result += applyMetaTokens(node.n, node.nameToken, 0)

    const flatParams = node.p.map(param => unparseNode(param, 0, maxLineLength)).join(' ')

    if (!flatParams.includes('\n') && result.length + 1 + flatParams.length < maxLineLength)
      return `${result} ${flatParams}${applyMetaTokens(')', node.endBracketToken, 0)}`

    let indentedParams = node.p.map(param => unparseNode(param, col + 1, maxLineLength))
      .reduce<string>((acc, param) => {
        if (acc && !acc.endsWith('\n') && !param.startsWith('\n'))
          return `${acc}\n${param}`
        return `${acc}${param}`
      }, '')
    indentedParams = result.endsWith('\n') || indentedParams.startsWith('\n') ? indentedParams : `\n${indentedParams}`
    return `${result}${indentedParams}${applyMetaTokens(')', node.endBracketToken, 0)}`
  }
  else {
    throw new Error('Not implemented')
  }
}
