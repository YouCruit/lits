import { describe, expect, it } from 'vitest'
import { Lits } from '../../../Lits/Lits'
import { unparseAst } from '../../unparse'

const lits = new Lits({ debug: true })

const sampleProgram = '(do foo (bar 1 2) baz)'
const sampleProgramWithComments = `
;; Leading Comment
(do ;; Inline comment
  ;; Leading comment
  foo

  ;; Comment

  ;; Leading Comment
  (bar 1 2) ;; Inline comment
  baz) ;; Inline comment
`

describe('unparse expressions with params', () => {
  it('should unparse with zero params', () => {
    const program = '(do)\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast)).toEqual(program)
  })

  it('should unparse with 1 param', () => {
    const program = '(do foo)\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast)).toEqual(program)
    expect(unparseAst(ast, 1)).toEqual('(do\n  foo)\n')
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
(do ;; Inline comment
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
(do ;; Inline comment
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

  if (lineLength >= 13) {
    return `
(do foo
    (bar 1 2)
    baz)
`.trimStart()
  }

  if (lineLength >= 11) {
    return `
(do
  foo
  (bar 1 2)
  baz)
`.trimStart()
  }

  if (lineLength >= 9) {
    return `
(do
  foo
  (bar 1
       2)
  baz)
`.trimStart()
  }

  return `
(do
  foo
  (bar
   1
   2)
  baz)
`.trimStart()
}
