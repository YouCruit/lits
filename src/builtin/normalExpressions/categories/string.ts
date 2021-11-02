import { LitsError } from '../../../errors'
import { Any, Arr } from '../../../interface'
import { NormalExpressionNode } from '../../../parser/interface'
import { SourceCodeInfo } from '../../../tokenizer/interface'
import {
  assertLength,
  assertNonNegativeInteger,
  assertFiniteNumber,
  assertNumberGte,
  assertString,
  assertStringOrRegExp,
  assertStringArray,
  assertNonEmptyString,
  asNotUndefined,
  toNonNegativeInteger,
} from '../../../utils'
import { number, object, array } from '../../../utils/assertion'
import { BuiltinNormalExpressions } from '../../interface'

export const stringNormalExpression: BuiltinNormalExpressions = {
  subs: {
    evaluate: ([first, second, third], sourceCodeInfo): Any => {
      assertString(first, sourceCodeInfo)
      assertNonNegativeInteger(second, sourceCodeInfo)

      if (third === undefined) {
        return (first as string).substring(second)
      }

      assertNumberGte(third, second, sourceCodeInfo)
      return (first as string).substring(second, third)
    },
    validate: (node: NormalExpressionNode): void => assertLength({ min: 2, max: 3 }, node),
  },

  'string-repeat': {
    evaluate: ([string, count], sourceCodeInfo): string => {
      assertString(string, sourceCodeInfo)
      assertNonNegativeInteger(count, sourceCodeInfo)

      return string.repeat(count)
    },
    validate: node => assertLength(2, node),
  },

  str: {
    evaluate: (params: Arr) => {
      return params.reduce((result: string, param) => {
        const paramStr =
          param === undefined || param === null
            ? ``
            : object.is(param)
            ? JSON.stringify(param)
            : Array.isArray(param)
            ? JSON.stringify(param)
            : `${param}`
        return result + paramStr
      }, ``)
    },
  },

  number: {
    evaluate: ([str], sourceCodeInfo): number => {
      assertString(str, sourceCodeInfo)
      const number = Number(str)
      if (Number.isNaN(number)) {
        throw new LitsError(`Could not convert '${str}' to a number`, sourceCodeInfo)
      }
      return number
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  'number-to-string': {
    evaluate: (params, sourceCodeInfo): string => {
      const [number, base] = params
      assertFiniteNumber(number, sourceCodeInfo)
      if (params.length === 1) {
        return `${number}`
      } else {
        assertFiniteNumber(base, sourceCodeInfo)
        if (base !== 2 && base !== 8 && base !== 10 && base !== 16) {
          throw new LitsError(
            `Expected "number-to-string" base argument to be 2, 8, 10 or 16, got: ${base}`,
            sourceCodeInfo,
          )
        }
        if (base === 10) {
          return `${number}`
        }
        assertNonNegativeInteger(number, sourceCodeInfo)
        return Number(number).toString(base)
      }
    },
    validate: (node: NormalExpressionNode): void => assertLength({ min: 1, max: 2 }, node),
  },

  'from-char-code': {
    evaluate: ([number], sourceCodeInfo): string => {
      assertFiniteNumber(number, sourceCodeInfo)
      const int = toNonNegativeInteger(number)

      return String.fromCodePoint(int)
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  'to-char-code': {
    evaluate: ([str], sourceCodeInfo): number => {
      assertNonEmptyString(str, sourceCodeInfo)
      return asNotUndefined(str.codePointAt(0), sourceCodeInfo)
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  'lower-case': {
    evaluate: ([str], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      return str.toLowerCase()
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  'upper-case': {
    evaluate: ([str], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      return str.toUpperCase()
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  trim: {
    evaluate: ([str], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      return str.trim()
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  'trim-left': {
    evaluate: ([str], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      return str.replace(/^\s+/, ``)
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  'trim-right': {
    evaluate: ([str], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      return str.replace(/\s+$/, ``)
    },
    validate: (node: NormalExpressionNode): void => assertLength(1, node),
  },

  join: {
    evaluate: ([stringList, delimiter], sourceCodeInfo): string => {
      array.assert(stringList, sourceCodeInfo)
      stringList.forEach(str => assertString(str, sourceCodeInfo))
      assertString(delimiter, sourceCodeInfo)
      return stringList.join(delimiter)
    },
    validate: (node: NormalExpressionNode): void => assertLength(2, node),
  },

  split: {
    evaluate: ([str, delimiter, limit], sourceCodeInfo): string[] => {
      assertString(str, sourceCodeInfo)
      assertStringOrRegExp(delimiter, sourceCodeInfo)
      if (limit !== undefined) {
        assertNonNegativeInteger(limit, sourceCodeInfo)
      }
      return str.split(delimiter, limit)
    },
    validate: (node: NormalExpressionNode): void => assertLength({ min: 2, max: 3 }, node),
  },

  'pad-left': {
    evaluate: ([str, length, padString], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      number.assert(length, sourceCodeInfo, { integer: true })

      if (padString !== undefined) {
        assertString(padString, sourceCodeInfo)
      }

      return str.padStart(length, padString)
    },
    validate: (node: NormalExpressionNode): void => assertLength({ min: 2, max: 3 }, node),
  },

  'pad-right': {
    evaluate: ([str, length, padString], sourceCodeInfo): string => {
      assertString(str, sourceCodeInfo)
      number.assert(length, sourceCodeInfo, { integer: true })

      if (padString !== undefined) {
        assertString(padString, sourceCodeInfo)
      }

      return str.padEnd(length, padString)
    },
    validate: (node: NormalExpressionNode): void => assertLength({ min: 2, max: 3 }, node),
  },

  template: {
    evaluate: ([templateString, ...placeholders], sourceCodeInfo): string => {
      assertString(templateString, sourceCodeInfo)
      const templateStrings = templateString.split(`||||`)
      if (templateStrings.length === 1) {
        assertStringArray(placeholders, sourceCodeInfo)
        return applyPlaceholders(templateStrings[0] as string, placeholders, sourceCodeInfo)
      } else if (templateStrings.length === 2) {
        const firstPlaceholder = placeholders[0]
        assertNonNegativeInteger(firstPlaceholder, sourceCodeInfo)
        const stringPlaceholders = [`${firstPlaceholder}`, ...placeholders.slice(1)] as string[]
        if (firstPlaceholder === 1) {
          return applyPlaceholders(templateStrings[0] as string, stringPlaceholders, sourceCodeInfo)
        } else {
          return applyPlaceholders(templateStrings[1] as string, stringPlaceholders, sourceCodeInfo)
        }
      } else {
        throw new LitsError(`Invalid template string, only one "||||" separator allowed`, sourceCodeInfo)
      }
    },
    validate: (node: NormalExpressionNode): void => assertLength({ min: 1, max: 10 }, node),
  },
}

const doubleDollarRegexp = /\$\$/g
function applyPlaceholders(templateString: string, placeholders: string[], sourceCodeInfo: SourceCodeInfo): string {
  for (let i = 0; i < 9; i += 1) {
    const re = new RegExp(`(?<=^|[^$]|\\$\\$)\\$${i + 1}`, `g`)
    if (re.test(templateString)) {
      const placeholder = placeholders[i]
      assertString(placeholder, sourceCodeInfo)
      templateString = templateString.replace(re, placeholder)
    }
  }
  return templateString.replace(doubleDollarRegexp, `$`)
}
