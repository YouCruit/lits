import { describe, it } from 'vitest'
import { Lits } from '../../../Lits/Lits'
import { testFormatter } from '../testFormatter'

const lits = new Lits({ debug: true })

const sampleProgram = '(cond foo (bar 1 2), baz (qux 3 4))'

describe('unparse cond', () => {
  describe('unparse sampleProgram', () => {
    for (let lineLength = 0; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        testFormatter(
          program => lits.format(program, { lineLength }),
          sampleProgram,
          formatSampleProgram(lineLength),
        )
      })
    }
  })

  it('should work 1', () => {
    const program = `(cond
  foo (bar 1
           2)
  baz (qux 3
           4))
`
    testFormatter(
      p => lits.format(p, { lineLength: 14 }),
      program,
      program,
    )
  })
})

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= sampleProgram.length || lineLength === 0)
    return `${sampleProgram}\n`

  if (lineLength >= 20) {
    return `
(cond foo (bar 1 2)
      baz (qux 3 4))
`.trimStart()
  }

  if (lineLength >= 16) {
    return `
(cond
  foo (bar 1 2)
  baz (qux 3 4))
`.trimStart()
  }

  if (lineLength >= 15) {
    return `
(cond
  foo
  (bar 1 2)
  baz
  (qux 3 4))
`.trimStart()
  }

  if (lineLength >= 14) {
    return `
(cond
  foo (bar 1
           2)
  baz (qux 3
           4))
`.trimStart()
  }

  if (lineLength >= 13) {
    return `
(cond
  foo
  (bar 1 2)
  baz
  (qux 3 4))
`.trimStart()
  }

  if (lineLength >= 10) {
    return `
(cond
  foo (bar
       1
       2)
  baz (qux
       3
       4))
`.trimStart()
  }

  if (lineLength >= 9) {
    return `
(cond
  foo
  (bar 1
       2)
  baz
  (qux 3
       4))
`.trimStart()
  }

  return `
(cond
  foo
  (bar
   1
   2)
  baz
  (qux
   3
   4))
`.trimStart()
}
