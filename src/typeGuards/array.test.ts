import type { DebugInfo } from '../tokenizer/interface'
import { asArray, assertArray } from './array'

const debugInfo: DebugInfo = `EOF`

describe(`array type guards`, () => {
  test(`assertArray`, () => {
    expect(() => assertArray(0, debugInfo)).toThrow()
    expect(() => assertArray({}, debugInfo)).toThrow()
    expect(() => assertArray([], debugInfo)).not.toThrow()
    expect(() => assertArray([1], debugInfo)).not.toThrow()
    expect(() => assertArray(true, debugInfo)).toThrow()
    expect(() => assertArray(null, debugInfo)).toThrow()
    expect(() => assertArray(undefined, debugInfo)).toThrow()
  })
  test(`asArray`, () => {
    const arr1: unknown[] = []
    const arr2 = [1]

    expect(() => asArray(0, debugInfo)).toThrow()
    expect(() => asArray({}, debugInfo)).toThrow()
    expect(asArray(arr1, debugInfo)).toBe(arr1)
    expect(asArray(arr2, debugInfo)).toBe(arr2)
    expect(() => asArray(true, debugInfo)).toThrow()
    expect(() => asArray(null, debugInfo)).toThrow()
    expect(() => asArray(undefined, debugInfo)).toThrow()
  })
})
