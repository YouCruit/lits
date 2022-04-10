import { assertNumberOfParams, regExp, string } from '../../../utils/assertion'
import { BuiltinNormalExpressions } from '../../interface'

export const regexpNormalExpression: BuiltinNormalExpressions = {
  regexp: {
    evaluate: (params, debugInfo): RegExp => {
      const [first, second] = params
      string.assert(first, debugInfo)

      if (params.length === 1) {
        return new RegExp(first)
      }

      string.assert(second, debugInfo)
      return new RegExp(first, second)
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
  match: {
    evaluate: ([first, second], debugInfo): string[] | null => {
      regExp.assert(first, debugInfo)
      string.assert(second, debugInfo)

      const match = first.exec(second)
      if (match) {
        return [...match]
      }
      return null
    },
    validate: node => assertNumberOfParams(2, node),
  },
  replace: {
    evaluate: ([str, regexp, value], debugInfo): string => {
      string.assert(str, debugInfo)
      regExp.assert(regexp, debugInfo)
      string.assert(value, debugInfo)

      return str.replace(regexp, value)
    },
    validate: node => assertNumberOfParams(3, node),
  },
}
