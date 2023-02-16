import { Lits } from '../src'

describe(`getDataType.`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    test(`example`, () => {
      const program = `5`
      const dataTypes = lits.getDataType(program)
      expect(dataTypes.isNumber()).toBe(true)
    })
  }
})
