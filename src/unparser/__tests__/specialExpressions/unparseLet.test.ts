import { describe, expect, it } from 'vitest'
import { Lits } from '../../../Lits/Lits'
import { unparseAst } from '../../unparse'

const lits = new Lits({ debug: true })

const sampleProgram = '(let [foo 3, bar 4] foo (bar 1 2) baz)'
const sampleProgramWithComments = `
;; Leading Comment
(let ;; Inline comment
 [a ;; Inline comment
  10
  b
  20 ;; Inline Comment
 ] ;; Inline comment
  ;; Leading comment
  foo

  ;; Comment

  ;; Leading Comment
  (bar 1 2) ;; Inline comment
  baz) ;; Inline comment
`

describe('unparse expressions with params', () => {
  it('should work 1', () => {
    const tokenStream = lits.tokenize(sampleProgramWithComments, { debug: false })
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast)).toEqual('(let [a 10, b 20] foo (bar 1 2) baz)\n')

    expect(unparseAst(ast, 30)).toEqual(`
(let [a 10, b 20]
  foo
  (bar 1 2)
  baz)
`.trimStart())

    expect(unparseAst(ast, 15)).toEqual(`
(let [a 10
      b 20]
  foo
  (bar 1 2)
  baz)
`.trimStart())

    expect(unparseAst(ast, 10)).toEqual(`
(let [a
      10
      b
      20]
  foo
  (bar 1
       2)
  baz)
`.trimStart())

    expect(unparseAst(ast, 8)).toEqual(`
(let [a
      10
      b
      20]
  foo
  (bar
   1
   2)
  baz)
`.trimStart())
  })

  describe('unparse sampleProgram', () => {
    for (let lineLength = 0; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgram)
        const ast = lits.parse(tokenStream)
        expect(unparseAst(ast, lineLength)).toEqual(formatSampleProgram(lineLength))
      })
    }
  })

  describe('unparse sampleProgramWithComments', () => {
    for (let lineLength = 0; lineLength <= 30; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgramWithComments)
        const ast = lits.parse(tokenStream)
        expect(unparseAst(ast, lineLength)).toEqual(formatSampleProgramWithComments(lineLength))
      })
    }
  })
})

function formatSampleProgramWithComments(lineLength: number): string {
  if (lineLength >= 29 || lineLength === 0)
    return sampleProgramWithComments

  if (lineLength >= 27) {
    return `
;; Leading Comment
(let ;; Inline comment
 [a ;; Inline comment
  10
  b
  20 ;; Inline Comment
 ] ;; Inline comment
  ;; Leading comment
  foo

  ;; Comment

  ;; Leading Comment
  (bar 1
       2) ;; Inline comment
  baz) ;; Inline comment
`
  }

  return `
;; Leading Comment
(let ;; Inline comment
 [a ;; Inline comment
  10
  b
  20 ;; Inline Comment
 ] ;; Inline comment
  ;; Leading comment
  foo

  ;; Comment

  ;; Leading Comment
  (bar
   1
   2) ;; Inline comment
  baz) ;; Inline comment
`
}

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= sampleProgram.length || lineLength === 0)
    return `${sampleProgram}\n`

  if (lineLength >= 19) {
    return `
(let [foo 3, bar 4]
  foo
  (bar 1 2)
  baz)
`.trimStart()
  }

  if (lineLength >= 12) {
    return `
(let [foo 3
      bar 4]
  foo
  (bar 1 2)
  baz)
`.trimStart()
  }

  if (lineLength >= 11) {
    return `
(let [foo
      3
      bar
      4]
  foo
  (bar 1 2)
  baz)
`.trimStart()
  }

  if (lineLength >= 9) {
    return `
(let [foo
      3
      bar
      4]
  foo
  (bar 1
       2)
  baz)
`.trimStart()
  }

  return `
(let [foo
      3
      bar
      4]
  foo
  (bar
   1
   2)
  baz)
`.trimStart()
}
