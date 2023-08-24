import type { DebugInfo } from '../src/tokenizer/interface'
import type { NameNode, RegularExpression } from '../src/parser/interface'
import { collHasKey, deepEqual, toNonNegativeInteger, cloneColl } from '../src/utils'
import { REGEXP_SYMBOL } from '../src/utils/symbols'
import { valueToString } from '../src/utils/debug/debugTools'
import { AstNodeType } from '../src'

const debugInfo: DebugInfo = `EOF`
describe(`utils`, () => {
  test(`collHasKey`, () => {
    expect(collHasKey(10, 1)).toBe(false)

    expect(collHasKey(`Albert`, 1)).toBe(true)
    expect(collHasKey(`Albert`, -1)).toBe(false)
    expect(collHasKey(`Albert`, 1.2)).toBe(false)
    expect(collHasKey(`Albert`, 6)).toBe(false)
    expect(collHasKey(``, 0)).toBe(false)

    expect(collHasKey([1, 2, 3], 1)).toBe(true)
    expect(collHasKey([1, 2, 3], 6)).toBe(false)
    expect(collHasKey([], 0)).toBe(false)

    expect(collHasKey({ a: 1, b: 2 }, `a`)).toBe(true)
    expect(collHasKey({ a: 1, b: 2 }, `b`)).toBe(true)
    expect(collHasKey({ a: 1, b: 2 }, `c`)).toBe(false)
    expect(collHasKey({}, 0)).toBe(false)
    expect(collHasKey({}, `a`)).toBe(false)
  })

  const primitives = [0, 1, true, false, null, `Albert`, `Mojir`]
  describe(`deepEqual`, () => {
    test(`primitives`, () => {
      for (const a of primitives) {
        for (const b of primitives) {
          expect(deepEqual(a, b, debugInfo)).toBe(a === b)
        }
      }
    })
    test(`RegExp`, () => {
      const a: RegularExpression = {
        [REGEXP_SYMBOL]: true,
        s: `^ab`,
        f: ``,
      }
      const b: RegularExpression = {
        [REGEXP_SYMBOL]: true,
        s: `^ab`,
        f: ``,
      }
      const c: RegularExpression = {
        [REGEXP_SYMBOL]: true,
        s: `^ab`,
        f: `g`,
      }
      const d: RegularExpression = {
        [REGEXP_SYMBOL]: true,
        s: `^ab`,
        f: `g`,
      }
      expect(deepEqual(a, a, debugInfo)).toBe(true)
      expect(deepEqual(a, b, debugInfo)).toBe(true)
      expect(deepEqual(a, c, debugInfo)).toBe(false)
      expect(deepEqual(a, d, debugInfo)).toBe(false)
      expect(deepEqual(b, b, debugInfo)).toBe(true)
      expect(deepEqual(b, c, debugInfo)).toBe(false)
      expect(deepEqual(b, d, debugInfo)).toBe(false)
      expect(deepEqual(c, c, debugInfo)).toBe(true)
      expect(deepEqual(c, d, debugInfo)).toBe(true)
    })
    test(`nested structures`, () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3], debugInfo)).toBe(true)
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }, debugInfo)).toBe(true)
      expect(deepEqual([1, 2, { a: 1, b: 2 }], [1, 2, { b: 2, a: 1 }], debugInfo)).toBe(true)
    })
  })
  test(`toNonNegativeInteger`, () => {
    expect(toNonNegativeInteger(0)).toBe(0)
    expect(toNonNegativeInteger(-0.1)).toBe(0)
    expect(toNonNegativeInteger(-100)).toBe(0)
    expect(toNonNegativeInteger(0.01)).toBe(1)
    expect(toNonNegativeInteger(2.01)).toBe(3)
    expect(toNonNegativeInteger(4.0)).toBe(4)
  })

  describe(`cloneColl`, () => {
    test(`samples`, () => {
      expect(cloneColl({ a: 10 })).toEqual({ a: 10 })
      expect(cloneColl({ a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] })
    })
    test(`new instance`, () => {
      const original = { a: [1, 2, 3] }
      const second = cloneColl(original)
      expect(original).not.toBe(second)
      second.a[0] = 10
      expect(original.a[0]).toBe(1)
    })
  })

  describe(`helpers`, () => {
    const n: NameNode = {
      t: AstNodeType.Name,
      v: `Foo`,
    }
    test(`valueToString`, () => {
      expect(valueToString(new Error())).toBe(`Error`)
      expect(valueToString(n)).toBe(`Name-node`)
    })
  })
})
