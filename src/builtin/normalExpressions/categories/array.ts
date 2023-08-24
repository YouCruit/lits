import type { Arr } from '../../../interface'
import { assertArray } from '../../../typeGuards/array'
import { assertNumber } from '../../../typeGuards/number'
import { assertNumberOfParams } from '../../../utils'
import type { BuiltinNormalExpressions } from '../../interface'
import { evaluateMap } from './sequence'
export const arrayNormalExpression: BuiltinNormalExpressions = {
  array: {
    evaluate: (params): Arr => params,
  },

  range: {
    evaluate: (params, debugInfo): Arr => {
      const [first, second, third] = params
      let from: number
      let to: number
      let step: number
      assertNumber(first, debugInfo, { finite: true })

      if (params.length === 1) {
        from = 0
        to = first
        step = to >= 0 ? 1 : -1
      } else if (params.length === 2) {
        assertNumber(second, debugInfo, { finite: true })
        from = first
        to = second
        step = to >= from ? 1 : -1
      } else {
        assertNumber(second, debugInfo, { finite: true })
        assertNumber(third, debugInfo, { finite: true })
        from = first
        to = second
        step = third
        if (to > from) {
          assertNumber(step, debugInfo, { positive: true })
        } else if (to < from) {
          assertNumber(step, debugInfo, { negative: true })
        } else {
          assertNumber(step, debugInfo, { nonZero: true })
        }
      }

      const result: number[] = []

      for (let i = from; step < 0 ? i > to : i < to; i += step) {
        result.push(i)
      }

      return result
    },
    validate: node => assertNumberOfParams({ min: 1, max: 3 }, node),
  },

  repeat: {
    evaluate: ([count, value], debugInfo): Arr => {
      assertNumber(count, debugInfo, { integer: true, nonNegative: true })
      const result: Arr = []
      for (let i = 0; i < count; i += 1) {
        result.push(value)
      }
      return result
    },
    validate: node => assertNumberOfParams(2, node),
  },

  flatten: {
    evaluate: ([seq]): Arr => {
      if (!Array.isArray(seq)) {
        return []
      }
      return seq.flat(Number.POSITIVE_INFINITY)
    },
    validate: node => assertNumberOfParams(1, node),
  },
  mapcat: {
    evaluate: (params, debugInfo, contextStack, helpers): Arr | string => {
      params.slice(1).forEach(arr => {
        assertArray(arr, debugInfo)
      })
      const mapResult = evaluateMap(params, debugInfo, contextStack, helpers)
      assertArray(mapResult, debugInfo)
      return mapResult.flat(1)
    },
    validate: node => assertNumberOfParams({ min: 2 }, node),
  },
}
