import type { Any } from '../../../interface'
import { compare, deepEqual } from '../../../utils'
import type { BuiltinNormalExpressions } from '../../interface'
import { version } from '../../../../package.json'
import { asAny, assertAny } from '../../../typeGuards/lits'
import { assertNumber } from '../../../typeGuards/number'
import { assertString } from '../../../typeGuards/string'
import { assertNumberOfParams } from '../../../typeGuards'

const uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
const xyRegexp = /[xy]/g

export const miscNormalExpression: BuiltinNormalExpressions = {
  'not=': {
    evaluate: (params): boolean => {
      for (let i = 0; i < params.length - 1; i += 1) {
        for (let j = i + 1; j < params.length; j += 1) {
          if (params[i] === params[j])
            return false
        }
      }

      return true
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  '=': {
    evaluate: ([first, ...rest]): boolean => {
      for (const param of rest) {
        if (param !== first)
          return false
      }

      return true
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  'equal?': {
    evaluate: ([a, b], sourceCodeInfo): boolean => {
      return deepEqual(asAny(a, sourceCodeInfo), asAny(b, sourceCodeInfo), sourceCodeInfo)
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  '>': {
    evaluate: ([first, ...rest]): boolean => {
      let currentValue = first
      for (const param of rest) {
        if (compare(currentValue, param) <= 0)
          return false

        currentValue = param
      }
      return true
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  '<': {
    evaluate: ([first, ...rest]): boolean => {
      let currentValue = first
      for (const param of rest) {
        if (compare(currentValue, param) >= 0)
          return false

        currentValue = param
      }
      return true
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  '>=': {
    evaluate: ([first, ...rest]): boolean => {
      let currentValue = first
      for (const param of rest) {
        if (compare(currentValue, param) < 0)
          return false

        currentValue = param
      }
      return true
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },

  '<=': {
    evaluate: ([first, ...rest]): boolean => {
      let currentValue = first
      for (const param of rest) {
        if (compare(currentValue, param) > 0)
          return false

        currentValue = param
      }
      return true
    },
    validate: node => assertNumberOfParams({ min: 1 }, node),
  },
  'not': {
    evaluate: ([first]): boolean => !first,
    validate: node => assertNumberOfParams(1, node),
  },
  'inst-ms!': {
    evaluate: (): number => {
      return Date.now()
    },
    validate: node => assertNumberOfParams(0, node),
  },
  'inst-ms->iso-date-time': {
    evaluate: ([ms], sourceCodeInfo): string => {
      assertNumber(ms, sourceCodeInfo)
      return new Date(ms).toISOString()
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'iso-date-time->inst-ms': {
    evaluate: ([dateTime], sourceCodeInfo): number => {
      assertString(dateTime, sourceCodeInfo)
      const ms = new Date(dateTime).valueOf()
      assertNumber(ms, sourceCodeInfo, { finite: true })
      return ms
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'write!': {
    evaluate: (params, sourceCodeInfo): Any => {
      // eslint-disable-next-line no-console
      console.log(...params)

      if (params.length > 0)
        return asAny(params[params.length - 1], sourceCodeInfo)

      return null
    },
  },
  'boolean': {
    evaluate: ([value]): boolean => {
      return !!value
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'compare': {
    evaluate: ([a, b]): number => {
      return compare(a, b)
    },
    validate: node => assertNumberOfParams(2, node),
  },
  'uuid!': {
    evaluate: (): string => {
      return uuidTemplate.replace(xyRegexp, (character) => {
        const randomNbr = Math.floor(Math.random() * 16)
        const newValue = character === 'x' ? randomNbr : (randomNbr & 0x3) | 0x8
        return newValue.toString(16)
      })
    },
    validate: node => assertNumberOfParams(0, node),
  },
  'lits-version!': {
    evaluate: (): Any => {
      return version
    },
    validate: node => assertNumberOfParams(0, node),
  },
  'json-parse': {
    evaluate: ([first], sourceCodeInfo): Any => {
      assertString(first, sourceCodeInfo)
      // eslint-disable-next-line ts/no-unsafe-return
      return JSON.parse(first)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  'json-stringify': {
    evaluate: ([first, second], sourceCodeInfo): string => {
      assertAny(first, sourceCodeInfo)
      if (second === undefined)
        return JSON.stringify(first)

      assertNumber(second, sourceCodeInfo)
      return JSON.stringify(first, null, second)
    },
    validate: node => assertNumberOfParams({ min: 1, max: 2 }, node),
  },
}
