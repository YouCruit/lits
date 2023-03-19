import { Lits } from '../../../src'
import { DataType } from '../../../src/Lits/Lits'

describe(`type functions`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    describe(`type-of`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-of)`)).toThrow()
        expect(() => lits.run(`(type-of 1 2)`)).toThrow()
        expect(lits.run(`(type-of 1)`)).toEqual(DataType.positiveInteger)
        expect(lits.run(`(type-of 1.1)`)).toEqual(DataType.positiveNonInteger)
        expect(lits.run(`(type-of 0)`)).toEqual(DataType.zero)
        expect(lits.run(`(type-of -1)`)).toEqual(DataType.negativeInteger)
        expect(lits.run(`(type-of -1.1)`)).toEqual(DataType.negativeNonInteger)
      })
    })
    describe(`type-or`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-or)`)).toThrow()
        expect(lits.run(`(type-or ::integer)`)).toEqual(DataType.integer)
        expect(lits.run(`(type-or ::integer ::non-integer)`)).toEqual(DataType.number)
        expect(lits.run(`(type-or ::empty-array ::non-empty-array, ::object)`)).toEqual(
          DataType.array.or(DataType.object),
        )
      })
    })
    describe(`type-and`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-and)`)).toThrow()
        expect(lits.run(`(type-and ::integer)`)).toEqual(DataType.integer)
        expect(lits.run(`(type-and ::integer ::number)`)).toEqual(DataType.integer)
        expect(lits.run(`(type-and ::integer ::number ::string)`)).toEqual(DataType.never)
        expect(lits.run(`(type-and ::falsy (type-or ::boolean ::number))`)).toEqual(DataType.false.or(DataType.zero))
      })
    })
    describe(`type-exclude`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-exclude)`)).toThrow()
        expect(lits.run(`(type-exclude ::falsy)`)).toEqual(DataType.falsy)
        expect(lits.run(`(type-exclude ::falsy (type-or ::boolean ::number ::string))`)).toEqual(
          DataType.nan.or(DataType.nil),
        )
        expect(lits.run(`(type-exclude ::falsy ::boolean ::number ::string)`)).toEqual(DataType.nan.or(DataType.nil))
      })
    })
    describe(`type-exclude`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-exclude)`)).toThrow()
        expect(lits.run(`(type-exclude ::falsy)`)).toEqual(DataType.falsy)
        expect(lits.run(`(type-exclude ::falsy (type-or ::boolean ::number ::string))`)).toEqual(
          DataType.nan.or(DataType.nil),
        )
        expect(lits.run(`(type-exclude ::falsy ::boolean ::number ::string)`)).toEqual(DataType.nan.or(DataType.nil))
      })
    })
    describe(`type-is?`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-is?)`)).toThrow()
        expect(() => lits.run(`(type-is? ::nil)`)).toThrow()
        expect(() => lits.run(`(type-is? nil ::unknown)`)).toThrow()
        expect(lits.run(`(type-is? ::nil ::unknown)`)).toBe(true)
        expect(lits.run(`(type-is? ::integer ::number)`)).toBe(true)
        expect(lits.run(`(type-is? ::number ::integer)`)).toBe(false)
      })
    })
    describe(`type-equals?`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-equals?)`)).toThrow()
        expect(() => lits.run(`(type-equals? ::nil)`)).toThrow()
        expect(() => lits.run(`(type-equals? nil ::unknown)`)).toThrow()
        expect(lits.run(`(type-equals? ::number (type-or ::integer ::non-integer))`)).toBe(true)
        expect(lits.run(`(type-equals? ::integer ::number)`)).toBe(false)
      })
    })
    describe(`type-intersects?`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-intersects?)`)).toThrow()
        expect(() => lits.run(`(type-intersects? ::nil)`)).toThrow()
        expect(() => lits.run(`(type-intersects? nil ::unknown)`)).toThrow()
        expect(lits.run(`(type-intersects? ::number (type-or ::integer ::non-integer))`)).toBe(true)
        expect(lits.run(`(type-intersects? ::integer ::number)`)).toBe(true)
        expect(lits.run(`(type-intersects? ::number ::integer)`)).toBe(true)
        expect(lits.run(`(type-intersects? ::number ::string)`)).toBe(false)
      })
    })
  }
})
