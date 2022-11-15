import { LitsError } from '../errors'
import { LocationGetter } from '../Lits/Lits'
import { Token, Tokenizer, DebugInfo, TokenizeParams } from './interface'
import {
  skipComment,
  skipWhiteSpace,
  tokenizeLeftBracket,
  tokenizeLeftCurly,
  tokenizeLeftParen,
  tokenizeModifier,
  tokenizeName,
  tokenizeNumber,
  tokenizeReservedName,
  tokenizeRightBracket,
  tokenizeRightCurly,
  tokenizeRightParen,
  tokenizeString,
  tokenizeRegexpShorthand,
  tokenizeFnShorthand,
  tokenizeSymbolString,
} from './tokenizers'

// All tokenizers, order matters!
const tokenizers: Tokenizer[] = [
  skipComment,
  skipWhiteSpace,
  tokenizeLeftParen,
  tokenizeRightParen,
  tokenizeLeftBracket,
  tokenizeRightBracket,
  tokenizeLeftCurly,
  tokenizeRightCurly,
  tokenizeString,
  tokenizeSymbolString,
  tokenizeNumber,
  tokenizeReservedName,
  tokenizeName,
  tokenizeModifier,
  tokenizeRegexpShorthand,
  tokenizeFnShorthand,
]

function getSourceCodeLine(input: string, lineNbr: number): string {
  return input.split(/\r\n|\r|\n/)[lineNbr] as string
}

function getCodeMarker(code: string, column: number): string {
  const leftPadding = column - 1
  const rightPadding = code.length - leftPadding - 1
  return `${` `.repeat(Math.max(leftPadding, 0))}^${` `.repeat(Math.max(rightPadding, 0))}`
}

function createDebugInfo(input: string, position: number, getLocation?: LocationGetter): DebugInfo {
  const lines = input.substr(0, position + 1).split(/\r\n|\r|\n/)
  const lastLine = lines[lines.length - 1] as string

  const code = getSourceCodeLine(input, lines.length - 1)
  const line = lines.length
  const column = lastLine.length
  const codeMarker = getCodeMarker(code, column)
  return {
    code,
    line,
    column,
    codeMarker,
    getLocation,
  }
}

export function tokenize(input: string, params: TokenizeParams): Token[] {
  const tokens: Token[] = []
  let position = 0
  let tokenized = false
  while (position < input.length) {
    tokenized = false

    // Loop through all tokenizer until one matches
    const debugInfo: DebugInfo | undefined = params.debug
      ? createDebugInfo(input, position, params.getLocation)
      : undefined
    for (const tokenize of tokenizers) {
      const [nbrOfCharacters, token] = tokenize(input, position, debugInfo)

      // tokenizer matched
      if (nbrOfCharacters > 0) {
        tokenized = true
        position += nbrOfCharacters
        if (token) {
          tokens.push(token)
        }
        break
      }
    }
    if (!tokenized) {
      throw new LitsError(`Unrecognized character '${input[position]}'.`, debugInfo)
    }
  }
  return tokens
}
