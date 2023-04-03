import { Lits, LitsParams } from '../src'
import { assertType, Type } from '../src/types/Type'

const lits = new Lits()

describe(`Evaluate data types`, () => {
  test(`simple expression`, () => {
    const litsParams: LitsParams = {
      globals: {
        x: Type.positiveInteger,
      },
    }
    const result = lits.run(`(+ 10.1 x)`, litsParams)
    assertType(result, undefined)
  })
})

// describe(`dataType.`, () => {
//   test(`non zero number`, () => {
//     const program = `5.1`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(Type.number)).toBe(true)
//     expect(dataType.is(Type.zero)).toBe(false)
//     expect(dataType.is(Type.positiveNumber)).toBe(true)
//     expect(dataType.is(Type.truthy)).toBe(true)
//     expect(dataType.is(Type.falsy)).toBe(false)
//   })
//   test(`zero`, () => {
//     const program = `0`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(Type.number)).toBe(true)
//     expect(dataType.is(Type.zero)).toBe(true)
//     expect(dataType.is(Type.positiveNumber)).toBe(false)
//     expect(dataType.is(Type.truthy)).toBe(false)
//     expect(dataType.is(Type.falsy)).toBe(true)
//   })
//   test(`non empty string`, () => {
//     const program = `" "`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(Type.string)).toBe(true)
//     expect(dataType.is(Type.emptyString)).toBe(false)
//     expect(dataType.is(Type.nonEmptyString)).toBe(true)
//     expect(dataType.is(Type.truthy)).toBe(true)
//     expect(dataType.is(Type.falsy)).toBe(false)
//   })
//   test(`empty string`, () => {
//     const program = `""`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(Type.string)).toBe(true)
//     expect(dataType.is(Type.emptyString)).toBe(true)
//     expect(dataType.is(Type.nonEmptyString)).toBe(false)
//     expect(dataType.is(Type.truthy)).toBe(false)
//     expect(dataType.is(Type.falsy)).toBe(true)
//   })
//   test(`true`, () => {
//     const program = `true`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(Type.boolean)).toBe(true)
//     expect(dataType.is(Type.false)).toBe(false)
//     expect(dataType.is(Type.true)).toBe(true)
//     expect(dataType.is(Type.truthy)).toBe(true)
//     expect(dataType.is(Type.falsy)).toBe(false)
//   })
//   test(`false`, () => {
//     const program = `false`
//     const dataType = lits.getDataType(program)
//     expect(dataType.is(Type.boolean)).toBe(true)
//     expect(dataType.is(Type.false)).toBe(true)
//     expect(dataType.is(Type.true)).toBe(false)
//     expect(dataType.is(Type.truthy)).toBe(false)
//     expect(dataType.is(Type.falsy)).toBe(true)
//   })

//   describe(`expressions.`, () => {
//     test(`simple expression.`, () => {
//       const program = `(+ 1 2)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(Type.positiveInteger)
//     })

//     test(`another simple expression.`, () => {
//       const program = `(+ -1 2.2)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(Type.number)
//     })
//   })

//   describe(`functions`, () => {
//     test(`simple function.`, () => {
//       const program = `(defn foo [] 1) foo`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(Type.function.withReturnType(Type.positiveInteger))
//     })
//     test(`simple function's return type`, () => {
//       const program = `(defn foo [] 1) (foo)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(Type.positiveInteger)
//     })
//     test(`function with expression.`, () => {
//       const program = `(defn foo [x] (+ x 2)) foo`
//       const dataType = lits.getDataType(program)
//       console.log(dataType.toString())

//       expect(dataType).toEqual(Type.function.withReturnType(Type.number))
//     })
//     test(`function with expression's return type`, () => {
//       const program = `(defn foo [x] (+ x 2)) (foo 1)`
//       const dataType = lits.getDataType(program)
//       expect(dataType).toEqual(Type.positiveInteger)
//     })
//   })
// })
