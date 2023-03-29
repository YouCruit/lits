import { Lits } from '../../../src'
import { DataType } from '../../../src/Lits/Lits'

describe(`type functions`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    describe(`type-of`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-of)`)).toThrow()
        expect(() => lits.run(`(type-of 1 2)`)).toThrow()
        expect(lits.run(`(type-of 1)`)).toEqual(DataType.positiveInteger)
        expect(lits.run(`(type-of 1.1)`)).toEqual(DataType.positiveFloat)
        expect(lits.run(`(type-of 0)`)).toEqual(DataType.zero)
        expect(lits.run(`(type-of -1)`)).toEqual(DataType.negativeInteger)
        expect(lits.run(`(type-of -1.1)`)).toEqual(DataType.negativeFloat)
      })
    })
    describe(`type-or`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-or)`)).toThrow()
        expect(lits.run(`(type-or ::integer)`)).toEqual(DataType.integer)
        expect(lits.run(`(type-or ::integer ::float)`)).toEqual(DataType.float)
        expect(lits.run(`(type-or ::empty-array ::non-empty-array, ::object)`)).toEqual(
          DataType.array.or(DataType.object),
        )
      })
    })
    describe(`type-and`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-and)`)).toThrow()
        expect(lits.run(`(type-and ::integer)`)).toEqual(DataType.integer)
        expect(lits.run(`(type-and ::integer ::float)`)).toEqual(DataType.integer)
        expect(lits.run(`(type-and ::integer ::float ::string)`)).toEqual(DataType.never)
        expect(lits.run(`(type-and ::falsy (type-or ::boolean ::float))`)).toEqual(DataType.false.or(DataType.zero))
      })
    })
    describe(`type-exclude`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-exclude)`)).toThrow()
        expect(lits.run(`(type-exclude ::falsy)`)).toEqual(DataType.falsy)
        expect(lits.run(`(type-exclude ::falsy (type-or ::boolean ::float ::string))`)).toEqual(
          DataType.nan.or(DataType.nil),
        )
        expect(lits.run(`(type-exclude ::falsy ::boolean ::float ::string)`)).toEqual(DataType.nan.or(DataType.nil))
      })
    })
    describe(`type-exclude`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-exclude)`)).toThrow()
        expect(lits.run(`(type-exclude ::falsy)`)).toEqual(DataType.falsy)
        expect(lits.run(`(type-exclude ::falsy (type-or ::boolean ::float ::string))`)).toEqual(
          DataType.nan.or(DataType.nil),
        )
        expect(lits.run(`(type-exclude ::falsy ::boolean ::float ::string)`)).toEqual(DataType.nan.or(DataType.nil))
      })
    })
    describe(`type-is?`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-is?)`)).toThrow()
        expect(() => lits.run(`(type-is? ::nil)`)).toThrow()
        expect(() => lits.run(`(type-is? nil ::unknown)`)).toThrow()
        expect(lits.run(`(type-is? ::nil ::unknown)`)).toBe(true)
        expect(lits.run(`(type-is? ::integer ::float)`)).toBe(true)
        expect(lits.run(`(type-is? ::float ::integer)`)).toBe(false)
      })
    })
    describe(`type-equals?`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-equals?)`)).toThrow()
        expect(() => lits.run(`(type-equals? ::nil)`)).toThrow()
        expect(() => lits.run(`(type-equals? nil ::unknown)`)).toThrow()
        expect(lits.run(`(type-equals? ::integer ::float)`)).toBe(false)
      })
    })
    describe(`type-intersects?`, () => {
      test(`samples`, () => {
        expect(() => lits.run(`(type-intersects?)`)).toThrow()
        expect(() => lits.run(`(type-intersects? ::nil)`)).toThrow()
        expect(() => lits.run(`(type-intersects? nil ::unknown)`)).toThrow()
        expect(lits.run(`(type-intersects? ::integer ::float)`)).toBe(true)
        expect(lits.run(`(type-intersects? ::float ::integer)`)).toBe(true)
        expect(lits.run(`(type-intersects? ::float ::string)`)).toBe(false)
      })
    })
  }
})
