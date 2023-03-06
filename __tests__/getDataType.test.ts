import { Lits } from '../src'
import { DataType } from '../src/analyze/dataTypes/DataType'

describe(`dataType.`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    test(`non zero number`, () => {
      const program = `5.1`
      const dataType = lits.dataType(program)
      expect(dataType.is(DataType.number)).toBe(true)
      expect(dataType.is(DataType.zero)).toBe(false)
      expect(dataType.is(DataType.nonZeroNumber)).toBe(true)
      expect(dataType.is(DataType.truthy)).toBe(true)
      expect(dataType.is(DataType.falsy)).toBe(false)
    })
    test(`zero`, () => {
      const program = `0`
      const dataType = lits.dataType(program)
      expect(dataType.is(DataType.number)).toBe(true)
      expect(dataType.is(DataType.zero)).toBe(true)
      expect(dataType.is(DataType.nonZeroNumber)).toBe(false)
      expect(dataType.is(DataType.truthy)).toBe(false)
      expect(dataType.is(DataType.falsy)).toBe(true)
    })
    test(`non empty string`, () => {
      const program = `" "`
      const dataType = lits.dataType(program)
      expect(dataType.is(DataType.string)).toBe(true)
      expect(dataType.is(DataType.emptyString)).toBe(false)
      expect(dataType.is(DataType.nonEmptyString)).toBe(true)
      expect(dataType.is(DataType.truthy)).toBe(true)
      expect(dataType.is(DataType.falsy)).toBe(false)
    })
    test(`empty string`, () => {
      const program = `""`
      const dataType = lits.dataType(program)
      expect(dataType.is(DataType.string)).toBe(true)
      expect(dataType.is(DataType.emptyString)).toBe(true)
      expect(dataType.is(DataType.nonEmptyString)).toBe(false)
      expect(dataType.is(DataType.truthy)).toBe(false)
      expect(dataType.is(DataType.falsy)).toBe(true)
    })
    test(`true`, () => {
      const program = `true`
      const dataType = lits.dataType(program)
      expect(dataType.is(DataType.boolean)).toBe(true)
      expect(dataType.is(DataType.false)).toBe(false)
      expect(dataType.is(DataType.true)).toBe(true)
      expect(dataType.is(DataType.truthy)).toBe(true)
      expect(dataType.is(DataType.falsy)).toBe(false)
    })
    test(`false`, () => {
      const program = `false`
      const dataType = lits.dataType(program)
      expect(dataType.is(DataType.boolean)).toBe(true)
      expect(dataType.is(DataType.false)).toBe(true)
      expect(dataType.is(DataType.true)).toBe(false)
      expect(dataType.is(DataType.truthy)).toBe(false)
      expect(dataType.is(DataType.falsy)).toBe(true)
    })
  }
})
