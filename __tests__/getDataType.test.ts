import { Lits, LitsParams } from '../src'
import { DataType } from '../src/analyze/dataTypes/DataType'
import { dataType } from '../src/utils/assertion'

const lits = new Lits()

describe(`Evaluate data types`, () => {
  test(`simple expression`, () => {
    const litsParams: LitsParams = {
      globals: {
        x: DataType.positiveInteger,
      },
    }
    const result = lits.run(`(+ 10.1 x)`, litsParams)
    dataType.assert(result)
  })
})

// describe(`dataType.`, () => {
//   test(`non zero number`, () => {
//     const program = `5.1`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(DataType.number)).toBe(true)
//     expect(dataType.is(DataType.zero)).toBe(false)
//     expect(dataType.is(DataType.positiveNumber)).toBe(true)
//     expect(dataType.is(DataType.truthy)).toBe(true)
//     expect(dataType.is(DataType.falsy)).toBe(false)
//   })
//   test(`zero`, () => {
//     const program = `0`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(DataType.number)).toBe(true)
//     expect(dataType.is(DataType.zero)).toBe(true)
//     expect(dataType.is(DataType.positiveNumber)).toBe(false)
//     expect(dataType.is(DataType.truthy)).toBe(false)
//     expect(dataType.is(DataType.falsy)).toBe(true)
//   })
//   test(`non empty string`, () => {
//     const program = `" "`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(DataType.string)).toBe(true)
//     expect(dataType.is(DataType.emptyString)).toBe(false)
//     expect(dataType.is(DataType.nonEmptyString)).toBe(true)
//     expect(dataType.is(DataType.truthy)).toBe(true)
//     expect(dataType.is(DataType.falsy)).toBe(false)
//   })
//   test(`empty string`, () => {
//     const program = `""`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(DataType.string)).toBe(true)
//     expect(dataType.is(DataType.emptyString)).toBe(true)
//     expect(dataType.is(DataType.nonEmptyString)).toBe(false)
//     expect(dataType.is(DataType.truthy)).toBe(false)
//     expect(dataType.is(DataType.falsy)).toBe(true)
//   })
//   test(`true`, () => {
//     const program = `true`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(DataType.boolean)).toBe(true)
//     expect(dataType.is(DataType.false)).toBe(false)
//     expect(dataType.is(DataType.true)).toBe(true)
//     expect(dataType.is(DataType.truthy)).toBe(true)
//     expect(dataType.is(DataType.falsy)).toBe(false)
//   })
//   test(`false`, () => {
//     const program = `false`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(DataType.boolean)).toBe(true)
//     expect(dataType.is(DataType.false)).toBe(true)
//     expect(dataType.is(DataType.true)).toBe(false)
//     expect(dataType.is(DataType.truthy)).toBe(false)
//     expect(dataType.is(DataType.falsy)).toBe(true)
//   })

//   describe(`expressions.`, () => {
//     test(`simple expression.`, () => {
//       const program = `(+ 1 2)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(DataType.positiveInteger)
//     })

//     test(`another simple expression.`, () => {
//       const program = `(+ -1 2.2)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(DataType.number)
//     })
//   })

//   describe(`functions`, () => {
//     test(`simple function.`, () => {
//       const program = `(defn foo [] 1) foo`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(DataType.function.withReturnType(DataType.positiveInteger))
//     })
//     test(`simple function's return type`, () => {
//       const program = `(defn foo [] 1) (foo)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(DataType.positiveInteger)
//     })
//     test(`function with expression.`, () => {
//       const program = `(defn foo [x] (+ x 2)) foo`
//       const dataType = lits.getDataType(program)
//       console.log(dataType.toString())

//       expect(dataType).toEqual(DataType.function.withReturnType(DataType.number))
//     })
//     test(`function with expression's return type`, () => {
//       const program = `(defn foo [x] (+ x 2)) (foo 1)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(DataType.positiveInteger)
//     })
//   })
// })
