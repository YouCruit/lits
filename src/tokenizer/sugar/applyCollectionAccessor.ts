import { SugarFunction } from '.'
import { LitsError } from '../../errors'
import { asValue, number } from '../../utils/assertion'
import { DebugInfo, Token, TokenizerType } from '../interface'

export const applyCollectionAccessors: SugarFunction = tokens => {
  let dotTokenIndex = tokens.findIndex(tkn => tkn.t === TokenizerType.CollectionAccessor)
  while (dotTokenIndex >= 0) {
    applyCollectionAccessor(tokens, dotTokenIndex)
    dotTokenIndex = tokens.findIndex(tkn => tkn.t === TokenizerType.CollectionAccessor)
  }
  return tokens
}

function applyCollectionAccessor(tokens: Token[], position: number) {
  const dotTkn = asValue(tokens[position])
  const debugInfo = dotTkn.d
  const backPosition = getPositionBackwards(tokens, position, debugInfo)
  checkForward(tokens, position, dotTkn, debugInfo)

  tokens.splice(position, 1)
  tokens.splice(backPosition, 0, {
    t: TokenizerType.Bracket,
    v: `(`,
    d: debugInfo,
  })
  const nextTkn = asValue(tokens[position + 1])
  if (dotTkn.v === `.`) {
    tokens[position + 1] = {
      t: TokenizerType.String,
      v: nextTkn.v,
      d: nextTkn.d,
    }
  } else {
    number.assert(Number(nextTkn.v), debugInfo, { integer: true, nonNegative: true })
    tokens[position + 1] = {
      t: TokenizerType.Number,
      v: nextTkn.v,
      d: nextTkn.d,
    }
  }
  tokens.splice(position + 2, 0, {
    t: TokenizerType.Bracket,
    v: `)`,
    d: debugInfo,
  })
}

function getPositionBackwards(tokens: Token[], position: number, debugInfo: DebugInfo | undefined) {
  let bracketCount: number | null = null
  if (position <= 0) {
    throw new LitsError(`Array accessor # must come after a sequence`, debugInfo)
  }
  const prevToken = asValue(tokens[position - 1])
  let openBracket: null | `(` | `[` | `{` = null
  let closeBracket: null | `)` | `]` | `}` = null

  if (prevToken.t === TokenizerType.Bracket) {
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
    const tkn = asValue(tokens[position], debugInfo)
    if (tkn.t === TokenizerType.Bracket) {
      if (tkn.v === openBracket) {
        bracketCount += 1
      }
      if (tkn.v === closeBracket) {
        bracketCount -= 1
      }
    }
  }
  if (openBracket === `(` && position > 0) {
    const prevToken = asValue(tokens[position - 1])
    if (prevToken.t === TokenizerType.FnShorthand) {
      throw new LitsError(`# or . must NOT be preceeded by shorthand lambda function`, debugInfo)
    }
  }
  return position
}

function checkForward(tokens: Token[], position: number, dotTkn: Token, debugInfo: DebugInfo | undefined) {
  const tkn = asValue(tokens[position + 1], debugInfo)

  if (dotTkn.v === `.` && tkn.t !== TokenizerType.Name) {
    throw new LitsError(`# as a collection accessor must be followed by an name`, debugInfo)
  }
  if (dotTkn.v === `#` && tkn.t !== TokenizerType.Number) {
    throw new LitsError(`# as a collection accessor must be followed by an integer`, debugInfo)
  }
}
