import type { RegularExpression } from '../../../parser/interface'
import { assertRegularExpression } from '../../../typeGuards/lits'
import { assertString } from '../../../typeGuards/string'
import { assertNumberOfParams } from '../../../utils'
import { REGEXP_SYMBOL } from '../../../utils/symbols'
import type { BuiltinNormalExpressions } from '../../interface'

export const regexpNormalExpression: BuiltinNormalExpressions = {
  regexp: {
    evaluate: ([sourceArg, flagsArg], debugInfo): RegularExpression => {
      assertString(sourceArg, debugInfo)
      const source = sourceArg || `(?:)`
      const flags = typeof flagsArg === `string` ? flagsArg : ``
      new RegExp(source, flags) // Throws if invalid regexp
      return {
        [REGEXP_SYMBOL]: true,
        d: debugInfo,
        s: source,
        f: flags,
      }
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  match: {
    evaluate: ([regexp, text], debugInfo): string[] | null => {
      assertRegularExpression(regexp, debugInfo)
      assertString(text, debugInfo)
      const regExp = new RegExp(regexp.s, regexp.f)

      const match = regExp.exec(text)
      if (match) {
        return [...match]
      }
      return null
    },
    validate: node => assertNumberOfParams(2, node),
  },
  replace: {
    evaluate: ([str, regexp, value], debugInfo): string => {
      assertString(str, debugInfo)
      assertRegularExpression(regexp, debugInfo)
      assertString(value, debugInfo)

      const regExp = new RegExp(regexp.s, regexp.f)
      return str.replace(regExp, value)
    },
    validate: node => assertNumberOfParams(3, node),
  },
}
