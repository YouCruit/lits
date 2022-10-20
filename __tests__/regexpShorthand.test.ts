import { Lits } from '../src'
import { regexpEquals } from './testUtils'

let lits: Lits

beforeEach(() => {
  lits = new Lits({ debug: true })
})

describe(`regexpShorthand`, () => {
  test(`samples`, () => {
    expect(regexpEquals(lits.run(`#" "g`), / /g)).toBe(true)
    expect(regexpEquals(lits.run(`#"a"gi`), /a/gi)).toBe(true)
    expect(regexpEquals(lits.run(`#"a"ig`), /a/gi)).toBe(true)
    expect(regexpEquals(lits.run(`#"a"i`), /a/i)).toBe(true)
    expect(regexpEquals(lits.run(`#"^abc"`), /^abc/)).toBe(true)
    expect(() => lits.run(`#"a"is`)).toThrow()
    expect(() => lits.run(`#"a"s`)).toThrow()
    expect(() => lits.run(`#"a"ii`)).toThrow()
    expect(() => lits.run(`#"a"gg`)).toThrow()
  })
})
