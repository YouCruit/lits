import { TokenType } from '../constants/constants'
import type { Token, TokenStream } from '../tokenizer/interface'

export function tokensToProgram(tokens: TokenStream): string {
  let lastToken: Token | undefined
  return tokens.tokens.map((token) => {
    const result = `${getSeparator(lastToken, token)}${token.v}`
    lastToken = token
    return result
  }).join('')
}

function getSeparator(t1: Token | undefined, t2: Token): string {
  if (!t1)
    return ''

  if (isLeftBracket(t1))
    return ''

  if (isRightBracket(t2))
    return ''

  return ' '
}

function isLeftBracket(token: Token): boolean {
  return token.t === TokenType.Bracket && (token.v === '(' || token.v === '[' || token.v === '{')
}

function isRightBracket(token: Token): boolean {
  return token.t === TokenType.Bracket && (token.v === ')' || token.v === ']' || token.v === '}')
}
