import { FunctionType } from '../src/constants/constants'
import type { UnknownRecord } from '../src/interface'
import { isLitsFunction } from '../src/typeGuards/litsFunction'

export function throttle<T extends (...args: any[]) => void>(func: T) {
  let openForBusiness = true
  return function (this: any, ...args: Parameters<T>) {
    if (openForBusiness) {
      requestAnimationFrame(() => openForBusiness = true)
      openForBusiness = false
      func.apply(this, args)
    }
  }
}

export function stringifyValue(value: unknown): string {
  if (isLitsFunction(value)) {
    if (value.t === FunctionType.Builtin)
      return `&lt;builtin function ${value.n}&gt;`
    else
      return `&lt;function ${(value as unknown as UnknownRecord).n ?? '\u03BB'}&gt;`
  }
  if (value === null)
    return 'null'

  if (typeof value === 'object' && value instanceof Error)
    return value.toString()

  if (typeof value === 'object' && value instanceof RegExp)
    return `${value}`

  if (value === Number.POSITIVE_INFINITY)
    return `${Number.POSITIVE_INFINITY}`

  if (value === Number.NEGATIVE_INFINITY)
    return `${Number.NEGATIVE_INFINITY}`

  if (typeof value === 'number' && Number.isNaN(value))
    return 'NaN'

  return JSON.stringify(value, null, 2)
}
