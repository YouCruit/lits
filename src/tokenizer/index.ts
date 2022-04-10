import { LitsError } from '../errors'
import { Token, Tokenizer, DebugInfo, TokenizeParams } from './interface'
import { SourceCodeInfoImpl } from './SourceCodeInfoImpl'
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

function createDebugInfo(input: string, position: number, filename?: string): DebugInfo {
  const lines = input.substr(0, position + 1).split(/\r\n|\r|\n/)
  const lastLine = lines[lines.length - 1] as string

  const sourceCodeLine = getSourceCodeLine(input, lines.length - 1)
  return new SourceCodeInfoImpl(lines.length, lastLine.length, sourceCodeLine, filename)
}

export function tokenize(input: string, params: TokenizeParams): Token[] {
  const tokens: Token[] = []
  let position = 0
  let tokenized = false
  while (position < input.length) {
    tokenized = false

    // Loop through all tokenizer until one matches
    const debugInfo: DebugInfo = params.debug ? createDebugInfo(input, position, params.filename) : null
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
