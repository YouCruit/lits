import { describe, it } from 'vitest'
import { Lits } from '../../Lits/Lits'
import { testFormatter } from './testFormatter'

const lits = new Lits({ debug: true })

describe('unparseAst', () => {
  it('should work 1', () => {
    const program = `
(+

 ;; B
 1
)
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should work 2', () => {
    const program = `
(+
 (- 1)
 1
)
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should work 3', () => {
    const program = `
(+

 ;; Comment

 ;; Leading comment
 (- 1)

 ;; Leading comment
 1

 ;; Leading comment
 (- 1)
 ;; Leading comment

 (- 1)
 ;; Leading comment
 1
)
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should work 4', () => {
    const program = `
(+
 ;; Comment

 1
)
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })
  it('should work with comments 1', () => {
    const program = `
;; Comment 1

;; Comment 2
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should unparse ast with comments. 2.', () => {
    const program = `
;; A
(round ;; B
 ;; C
 (+ ;; D
  ;; E
  1 ;; F

  ;; G
  2 ;; H

  ;; I
  (/ 3 4)

  5)) ;; J
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  describe('nomal expression without name', () => {
    it('should work 1', () => {
      const program = `
(:Albert 0)
`
      testFormatter(
        p => lits.format(p),
        program,
        program,
      )
    })
    it('should work 2', () => {
      const program = `
(:Albert
 0)
`
      testFormatter(
        p => lits.format(p),
        program,
        program,
      )
    })
    it('should work 3', () => {
      const program = `
([1 2 3]
 0)
`
      testFormatter(
        p => lits.format(p),
        program,
        program,
      )
    })

    it('should work 4', () => {
      const program = `
([1 2 3]
 0)
`
      testFormatter(
        p => lits.format(p, { lineLength: 4 }),
        program,
        `
([1
  2
  3]
 0)
`,
      )
    })

    it('should work 5', () => {
      const program = `
([1
  2
  3]
 0)
`
      testFormatter(
        p => lits.format(p),
        program,
        program,
      )
    })

    it('should work 6', () => {
      const program = `
([1
  ;; Comment
  2
  ;; Comment

  ;; Comment
  3] ;; Comment
 ;; Comment
 0)
`
      testFormatter(
        p => lits.format(p),
        program,
        program,
      )
    })
  })

  // describe('collection accessors', () => {
  //   it.skip('should work 1', () => {
  //     const program = 'a.b.c#0'
  //     const tokenStream = lits.tokenize(program)
  //     const ast = lits.parse(tokenStream)
  //     expect(unparseAst(ast, 80)).toEqual(program)
  //   })
  // })

  describe('unparse sampleProgram', () => {
    const sampleProgram = '(round (+ 1 2 (/ 3 (max 1 2 3 4)) 5))'

    for (let lineLength = 0; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        testFormatter(
          p => lits.format(p, { lineLength }),
          sampleProgram,
          formatSampleProgram(lineLength),
        )
      })
    }
  })
})

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= 37 || lineLength === 0)
    return '(round (+ 1 2 (/ 3 (max 1 2 3 4)) 5))\n'

  if (lineLength >= 30) {
    return `
(round
 (+ 1 2 (/ 3 (max 1 2 3 4)) 5))
`.trimStart()
  }

  if (lineLength >= 27) {
    return `
(round
 (+ 1
    2
    (/ 3 (max 1 2 3 4))
    5))
`.trimStart()
  }

  if (lineLength >= 23) {
    return `
(round
 (+ 1
    2
    (/ 3 (max 1 2 3 4))
    5))
`.trimStart()
  }

  if (lineLength >= 21) {
    return `
(round
 (+
  1
  2
  (/ 3 (max 1 2 3 4))
  5))
`.trimStart()
  }

  if (lineLength >= 19) {
    return `
(round
 (+
  1
  2
  (/ 3
     (max 1 2 3 4))
  5))
`.trimStart()
  }

  if (lineLength >= 16) {
    return `
(round
 (+
  1
  2
  (/
   3
   (max 1 2 3 4))
  5))
`.trimStart()
  }

  if (lineLength >= 10) {
    return `
(round
 (+
  1
  2
  (/
   3
   (max 1
        2
        3
        4))
  5))
`.trimStart()
  }

  return `
(round
 (+
  1
  2
  (/
   3
   (max
    1
    2
    3
    4))
  5))
`.trimStart()
}
