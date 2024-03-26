import type { SugarFunction } from '.'
import { TokenType } from '../../constants/constants'
import { LitsError } from '../../errors'
import { asNonUndefined } from '../../typeGuards'
import { assertNumber } from '../../typeGuards/number'
import type { DebugInfo, Token, TokenStream } from '../interface'

export const applyCollectionAccessors: SugarFunction = tokenStream => {
  let dotTokenIndex = tokenStream.tokens.findIndex(tkn => tkn.t === TokenType.CollectionAccessor)
  while (dotTokenIndex >= 0) {
    applyCollectionAccessor(tokenStream, dotTokenIndex)
    dotTokenIndex = tokenStream.tokens.findIndex(tkn => tkn.t === TokenType.CollectionAccessor)
  }
  return tokenStream
}

function applyCollectionAccessor(tokenStream: TokenStream, position: number) {
  const dotTkn = asNonUndefined(tokenStream.tokens[position])
  const debugInfo = dotTkn.d
  const backPosition = getPositionBackwards(tokenStream, position, debugInfo)
  checkForward(tokenStream, position, dotTkn, debugInfo)

  tokenStream.tokens.splice(position, 1)
  tokenStream.tokens.splice(backPosition, 0, {
    t: TokenType.Bracket,
    v: `(`,
    d: debugInfo,
  })
  const nextTkn = asNonUndefined(tokenStream.tokens[position + 1])
  if (dotTkn.v === `.`) {
    tokenStream.tokens[position + 1] = {
      t: TokenType.String,
      v: nextTkn.v,
      d: nextTkn.d,
    }
  } else {
    assertNumber(Number(nextTkn.v), debugInfo, { integer: true, nonNegative: true })
    tokenStream.tokens[position + 1] = {
      t: TokenType.Number,
      v: nextTkn.v,
      d: nextTkn.d,
    }
  }
  tokenStream.tokens.splice(position + 2, 0, {
    t: TokenType.Bracket,
    v: `)`,
    d: debugInfo,
  })
}

function getPositionBackwards(tokenStream: TokenStream, position: number, debugInfo: DebugInfo | undefined) {
  let bracketCount: number | null = null
  if (position <= 0) {
    throw new LitsError(`Array accessor # must come after a sequence`, debugInfo)
  }
  const prevToken = asNonUndefined(tokenStream.tokens[position - 1])
  let openBracket: null | `(` | `[` | `{` = null
  let closeBracket: null | `)` | `]` | `}` = null

  if (prevToken.t === TokenType.Bracket) {
    switch (prevToken.v) {
      case `)`:
        openBracket = `(`
        closeBracket = `)`
        break
      case `]`:
        openBracket = `[`
        closeBracket = `]`
        break
      case `}`:
        openBracket = `{`
        closeBracket = `}`
        break
      default:
        throw new LitsError(`# or . must be preceeded by a collection`, debugInfo)
    }
  }

  while (bracketCount !== 0) {
    bracketCount = bracketCount === null ? 0 : bracketCount
    position -= 1
    const tkn = asNonUndefined(tokenStream.tokens[position], debugInfo)
    if (tkn.t === TokenType.Bracket) {
      if (tkn.v === openBracket) {
        bracketCount += 1
      }
      if (tkn.v === closeBracket) {
        bracketCount -= 1
      }
    }
  }
  if (openBracket === `(` && position > 0) {
    const tokenBeforeBracket = asNonUndefined(tokenStream.tokens[position - 1])
    if (tokenBeforeBracket.t === TokenType.FnShorthand) {
      throw new LitsError(`# or . must NOT be preceeded by shorthand lambda function`, debugInfo)
    }
  }
  return position
}

function checkForward(tokenStream: TokenStream, position: number, dotTkn: Token, debugInfo: DebugInfo | undefined) {
  const tkn = asNonUndefined(tokenStream.tokens[position + 1], debugInfo)

  if (dotTkn.v === `.` && tkn.t !== TokenType.Name) {
    throw new LitsError(`# as a collection accessor must be followed by an name`, debugInfo)
  }
  if (dotTkn.v === `#` && tkn.t !== TokenType.Number) {
    throw new LitsError(`# as a collection accessor must be followed by an integer`, debugInfo)
  }
}
