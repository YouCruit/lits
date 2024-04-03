import { assertNumber, asNumber, isNumber } from './number'

describe(`number type guards`, () => {
  test(`assertInteger`, () => {
    expect(() => assertNumber(-0, undefined, { integer: true })).not.toThrow()
    expect(() => assertNumber(-1, undefined, { integer: true })).not.toThrow()
    expect(() => assertNumber(1, undefined, { integer: true })).not.toThrow()
    expect(() => assertNumber(-0.1, undefined, { integer: true })).toThrow()
    expect(() => assertNumber(1.00001, undefined, { integer: true })).toThrow()
    expect(() => assertNumber(`k`, undefined, { integer: true })).toThrow()
    expect(() => assertNumber(false, undefined, { integer: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { integer: true })).toThrow()
    expect(() => assertNumber(null, undefined, { integer: true })).toThrow()
    expect(() => assertNumber([], undefined, { integer: true })).toThrow()
  })

  test(`assertPositiveNumber`, () => {
    expect(() => assertNumber(-1, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(-0.5, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(0, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(0.5, undefined, { positive: true })).not.toThrow()
    expect(() => assertNumber(1, undefined, { positive: true })).not.toThrow()
    expect(() => assertNumber(`1`, undefined, { positive: true })).toThrow()
    expect(() => assertNumber([], undefined, { positive: true })).toThrow()
    expect(() => assertNumber({}, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(true, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(false, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(null, undefined, { positive: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { positive: true })).toThrow()
  })
  test(`assertNegativeNumber`, () => {
    expect(() => assertNumber(-1, undefined, { negative: true })).not.toThrow()
    expect(() => assertNumber(-0.5, undefined, { negative: true })).not.toThrow()
    expect(() => assertNumber(0, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(0.5, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(1, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(`1`, undefined, { negative: true })).toThrow()
    expect(() => assertNumber([], undefined, { negative: true })).toThrow()
    expect(() => assertNumber({}, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(true, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(false, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(null, undefined, { negative: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { negative: true })).toThrow()
  })
  test(`assertNonNegativeNumber`, () => {
    expect(() => assertNumber(-1, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber(-1.1, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber(0, undefined, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(0.1, undefined, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(1, undefined, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(1.1, undefined, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(`1`, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber([], undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber({}, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber(true, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber(false, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber(null, undefined, { nonNegative: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { nonNegative: true })).toThrow()
  })
  test(`assertNonPositiveNumber`, () => {
    expect(() => assertNumber(-1, undefined, { nonPositive: true })).not.toThrow()
    expect(() => assertNumber(-1.1, undefined, { nonPositive: true })).not.toThrow()
    expect(() => assertNumber(0, undefined, { nonPositive: true })).not.toThrow()
    expect(() => assertNumber(0.1, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(1, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(1.1, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(`1`, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber([], undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber({}, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(true, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(false, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(null, undefined, { nonPositive: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { nonPositive: true })).toThrow()
  })
  test(`assertFiniteNumber`, () => {
    expect(() => assertNumber(-1, undefined, { finite: true })).not.toThrow()
    expect(() => assertNumber(-1.1, undefined, { finite: true })).not.toThrow()
    expect(() => assertNumber(0, undefined, { finite: true })).not.toThrow()
    expect(() => assertNumber(0.1, undefined, { finite: true })).not.toThrow()
    expect(() => assertNumber(1, undefined, { finite: true })).not.toThrow()
    expect(() => assertNumber(1.1, undefined, { finite: true })).not.toThrow()
    expect(() => assertNumber(Math.asin(2), undefined, { finite: true })).toThrow()
    expect(() => assertNumber(1 / 0, undefined, { finite: true })).toThrow()
    expect(() => assertNumber(`1`, undefined, { finite: true })).toThrow()
    expect(() => assertNumber([], undefined, { finite: true })).toThrow()
    expect(() => assertNumber({}, undefined, { finite: true })).toThrow()
    expect(() => assertNumber(true, undefined, { finite: true })).toThrow()
    expect(() => assertNumber(false, undefined, { finite: true })).toThrow()
    expect(() => assertNumber(null, undefined, { finite: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { finite: true })).toThrow()
  })
  test(`asFiniteNumber`, () => {
    expect(asNumber(-1, undefined, { finite: true })).toBe(-1)
    expect(asNumber(-1.1, undefined, { finite: true })).toBe(-1.1)
    expect(asNumber(0, undefined, { finite: true })).toBe(0)
    expect(asNumber(0.1, undefined, { finite: true })).toBe(0.1)
    expect(asNumber(1, undefined, { finite: true })).toBe(1)
    expect(asNumber(1.1, undefined, { finite: true })).toBe(1.1)
    expect(() => asNumber(Math.asin(2), undefined, { finite: true })).toThrow()
    expect(() => asNumber(1 / 0, undefined, { finite: true })).toThrow()
    expect(() => asNumber(`1`, undefined, { finite: true })).toThrow()
    expect(() => asNumber(`1`, undefined, { finite: true })).toThrow()
    expect(() => asNumber([], undefined, { finite: true })).toThrow()
    expect(() => asNumber({}, undefined, { finite: true })).toThrow()
    expect(() => asNumber(true, undefined, { finite: true })).toThrow()
    expect(() => asNumber(false, undefined, { finite: true })).toThrow()
    expect(() => asNumber(null, undefined, { finite: true })).toThrow()
    expect(() => asNumber(undefined, undefined, { finite: true })).toThrow()
  })
  test(`assertNumberGt`, () => {
    expect(() => assertNumber(0, undefined, { gt: 1 })).toThrow()
    expect(() => assertNumber(0.5, undefined, { gt: 1 })).toThrow()
    expect(() => assertNumber(1, undefined, { gt: 1 })).toThrow()
    expect(() => assertNumber(1.5, undefined, { gt: 1 })).not.toThrow()
    expect(() => assertNumber(2, undefined, { gt: 1 })).not.toThrow()
    expect(() => assertNumber(`2`, undefined, { gt: 1 })).toThrow()
    expect(() => assertNumber([], undefined, { gt: 1 })).toThrow()
    expect(() => assertNumber(false, undefined, { gt: 1 })).toThrow()
  })
  test(`assertNumberGte`, () => {
    expect(() => assertNumber(0, undefined, { gte: 1 })).toThrow()
    expect(() => assertNumber(0.5, undefined, { gte: 1 })).toThrow()
    expect(() => assertNumber(1, undefined, { gte: 1 })).not.toThrow()
    expect(() => assertNumber(1.5, undefined, { gte: 1 })).not.toThrow()
    expect(() => assertNumber(2, undefined, { gte: 1 })).not.toThrow()
    expect(() => assertNumber(`2`, undefined, { gte: 1 })).toThrow()
    expect(() => assertNumber([], undefined, { gte: 1 })).toThrow()
    expect(() => assertNumber(false, undefined, { gte: 1 })).toThrow()
  })
  test(`assertNumberLt`, () => {
    expect(() => assertNumber(0, undefined, { lt: 1 })).not.toThrow()
    expect(() => assertNumber(0.5, undefined, { lt: 1 })).not.toThrow()
    expect(() => assertNumber(1, undefined, { lt: 1 })).toThrow()
    expect(() => assertNumber(1.5, undefined, { lt: 1 })).toThrow()
    expect(() => assertNumber(2, undefined, { lt: 1 })).toThrow()
    expect(() => assertNumber(`2`, undefined, { lt: 1 })).toThrow()
    expect(() => assertNumber([], undefined, { lt: 1 })).toThrow()
    expect(() => assertNumber(false, undefined, { lt: 1 })).toThrow()
  })
  test(`assertNumberLte`, () => {
    expect(() => assertNumber(0, undefined, { lte: 1 })).not.toThrow()
    expect(() => assertNumber(0.5, undefined, { lte: 1 })).not.toThrow()
    expect(() => assertNumber(1, undefined, { lte: 1 })).not.toThrow()
    expect(() => assertNumber(1.5, undefined, { lte: 1 })).toThrow()
    expect(() => assertNumber(2, undefined, { lte: 1 })).toThrow()
    expect(() => assertNumber(`2`, undefined, { lte: 1 })).toThrow()
    expect(() => assertNumber([], undefined, { lte: 1 })).toThrow()
    expect(() => assertNumber(false, undefined, { lte: 1 })).toThrow()
  })
  test(`assertNumberNotZero`, () => {
    expect(() => assertNumber(-1, undefined, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(-0.5, undefined, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(0, undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber(0.5, undefined, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(1, undefined, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(`1`, undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber([], undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber({}, undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber(true, undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber(false, undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber(null, undefined, { nonZero: true })).toThrow()
    expect(() => assertNumber(undefined, undefined, { nonZero: true })).toThrow()
  })

  test(`isNumber`, () => {
    expect(isNumber(1 / 0)).toBe(true)
    expect(isNumber(Number(`abc`))).toBe(true)
    expect(isNumber(0.12)).toBe(true)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(`undefined`)).toBe(false)
    expect(isNumber([])).toBe(false)
  })

  test(`asInteger`, () => {
    expect(() => asNumber(1 / 0, undefined, { integer: true })).toThrow()
    expect(() => asNumber(Number(`abc`), undefined, { integer: true })).toThrow()
    expect(() => asNumber(12, undefined, { integer: true })).not.toThrow()
    expect(() => asNumber(undefined, undefined, { integer: true })).toThrow()
    expect(() => asNumber(`undefined`, undefined, { integer: true })).toThrow()
    expect(() => asNumber([], undefined, { integer: true })).toThrow()
  })

  test(`isInteger`, () => {
    expect(isNumber(1 / 0, { integer: true })).toBe(false)
    expect(isNumber(Number(`abc`), { integer: true })).toBe(false)
    expect(isNumber(0.12, { integer: true })).toBe(false)
    expect(isNumber(-12, { integer: true })).toBe(true)
    expect(isNumber(0, { integer: true })).toBe(true)
    expect(isNumber(12, { integer: true })).toBe(true)
    expect(isNumber(undefined, { integer: true })).toBe(false)
    expect(isNumber(`undefined`, { integer: true })).toBe(false)
    expect(isNumber([], { integer: true })).toBe(false)
  })

  test(`assertNumber`, () => {
    expect(() => assertNumber(1 / 0, undefined)).not.toThrow()
    expect(() => assertNumber(Number(`abc`), undefined)).not.toThrow()
    expect(() => assertNumber(0.12, undefined)).not.toThrow()
    expect(() => assertNumber(undefined, undefined)).toThrow()
    expect(() => assertNumber(`undefined`, undefined)).toThrow()
    expect(() => assertNumber([], undefined)).toThrow()
  })

  test(`assertMax`, () => {
    expect(() => assertNumber(12, undefined, { lte: 10 })).toThrow()
    expect(() => assertNumber(-12, undefined, { lte: -10 })).not.toThrow()
    expect(() => assertNumber(-8, undefined, { lte: -10 })).toThrow()
    expect(() => assertNumber(10, undefined, { lte: 10 })).not.toThrow()
    expect(() => assertNumber(0, undefined, { lte: 10 })).not.toThrow()
  })

  test(`number`, () => {
    expect(() => assertNumber(0, undefined, { zero: true })).not.toThrow()
    expect(() => assertNumber(1, undefined, { zero: true })).toThrow()
    expect(() => assertNumber(1.5, undefined, { gt: 1, lt: 2 })).not.toThrow()
    expect(() => assertNumber(1, undefined, { gt: 1, lt: 2 })).toThrow()
    expect(() => assertNumber(2, undefined, { gt: 1, lt: 2 })).toThrow()
    expect(() => assertNumber(1.5, undefined, { gte: 1, lte: 2 })).not.toThrow()
    expect(() => assertNumber(1, undefined, { gte: 1, lte: 2 })).not.toThrow()
    expect(() => assertNumber(2.5, undefined, { gte: 1, lte: 2 })).toThrow()
  })
})
