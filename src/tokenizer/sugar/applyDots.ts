import { SugarFunction } from '.'
import { LitsError } from '../../errors'
import { asValue, number } from '../../utils/assertion'
import { DebugInfo, Token } from '../interface'

export const applyDots: SugarFunction = tokens => {
  let dotTokenIndex = tokens.findIndex(tkn => tkn.type === `dot`)
  while (dotTokenIndex >= 0) {
    applyDot(tokens, dotTokenIndex)
    dotTokenIndex = tokens.findIndex(tkn => tkn.type === `dot`)
  }
  return tokens
}

function applyDot(tokens: Token[], position: number) {
  const dotTkn = asValue(tokens[position])
  const debugInfo = dotTkn.debugInfo
  const backPosition = getPositionBackwards(tokens, position, debugInfo)
  checkForward(tokens, position, dotTkn, debugInfo)

  tokens.splice(position, 1)
  tokens.splice(backPosition, 0, {
    type: `paren`,
    value: `(`,
    debugInfo,
  })
  const nextTkn = asValue(tokens[position + 1])
  if (dotTkn.value === `.`) {
    tokens[position + 1] = {
      type: `string`,
      value: nextTkn.value,
      debugInfo: nextTkn.debugInfo,
    }
  } else {
    number.assert(Number(nextTkn.value), debugInfo, { integer: true, nonNegative: true })
    tokens[position + 1] = {
      type: `number`,
      value: nextTkn.value,
      debugInfo: nextTkn.debugInfo,
    }
  }
  tokens.splice(position + 2, 0, {
    type: `paren`,
    value: `)`,
    debugInfo,
  })
}

function getPositionBackwards(tokens: Token[], position: number, debugInfo: DebugInfo | undefined) {
  let bracketCount: number | null = null
  if (position <= 0) {
    throw new LitsError(`Array accessor # must come after an array`, debugInfo)
  }
  const prevToken = asValue(tokens[position - 1])
  let openBracket: null | `(` | `[` | `{` = null
  let closeBracket: null | `)` | `]` | `}` = null

  if (prevToken.type === `paren`) {
    switch (prevToken.value) {
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
        throw new LitsError(`# or . must be preceeded by an array or an object`, debugInfo)
    }
  }

  while (bracketCount !== 0) {
    bracketCount = bracketCount === null ? 0 : bracketCount
    position -= 1
    const tkn = asValue(tokens[position], debugInfo)
    if (tkn.type === `paren`) {
      if (tkn.value === openBracket) {
        bracketCount += 1
      }
      if (tkn.value === closeBracket) {
        bracketCount -= 1
      }
    }
  }
  if (openBracket === `(` && position > 0) {
    const prevToken = asValue(tokens[position - 1])
    if (prevToken.type === `fnShorthand`) {
      throw new LitsError(`# or . must NOT be preceeded by shorthand lambda function`, debugInfo)
    }
  }
  return position
}

function checkForward(tokens: Token[], position: number, dotTkn: Token, debugInfo: DebugInfo | undefined) {
  const tkn = asValue(tokens[position + 1], debugInfo)

  if (dotTkn.value === `.` && tkn.type !== `name`) {
    throw new LitsError(`# as a array accessor must be followed by an name`, debugInfo)
  }
  if (dotTkn.value === `#` && tkn.type !== `number`) {
    throw new LitsError(`# as a array accessor must be followed by an integer`, debugInfo)
  }
}
