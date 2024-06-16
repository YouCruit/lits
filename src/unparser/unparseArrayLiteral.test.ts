import { describe, expect, it } from 'vitest'
import { Lits } from '../Lits/Lits'
import { unparseAst } from './unparse'

const lits = new Lits({ debug: true })
const sampleProgram = '(flatten [1 2 [3 4] 5])'
const sampleProgramWithComments = `
(flatten [(inc 1)
          ;; Second element
          2
          [{:a 1, :b 2} 4] ;; Third element

          ;; Comment

          {:foo [{}] ;; Inline
           :bar 5}]) ;; Last element
`

describe('unparseArrayLitteral', () => {
  it('shoudl unparse unply array', () => {
    const program = '[]'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual('[]\n')
  })

  it('should work 1', () => {
    const program = '[{}]\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 2', () => {
    const program = `
(flatten
 (identity
  [1 ;; A
   (+ 2
      3)
   ;; B
   [3 4]
   5]))
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 3', () => {
    const program = `
(slice [1 2 3 4 5]
       1
       3)
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual(program)
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
    for (let lineLength = 0; lineLength <= 43; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgramWithComments)
        const ast = lits.parse(tokenStream)
        expect(unparseAst(ast, lineLength)).toEqual(formatSampleProgramWithComments(lineLength))
      })
    }
  })
})

function formatSampleProgramWithComments(lineLength: number): string {
  if (lineLength >= 43 || lineLength === 0)
    return sampleProgramWithComments

  if (lineLength >= 35) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1, :b 2} 4] ;; Third element

  ;; Comment

  {:foo [{}] ;; Inline
   :bar 5}]) ;; Last element
`
  }

  if (lineLength >= 22) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1, :b 2}
   4] ;; Third element

  ;; Comment

  {:foo [{}] ;; Inline
   :bar 5}]) ;; Last element
`
  }

  if (lineLength >= 15) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1, :b 2}
   4] ;; Third element

  ;; Comment

  {:foo
   [{}] ;; Inline
   :bar
   5}]) ;; Last element
`
  }

  if (lineLength >= 9) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1
    :b 2}
   4] ;; Third element

  ;; Comment

  {:foo
   [{}] ;; Inline
   :bar
   5}]) ;; Last element
`
  }

  return `
(flatten
 [(inc
   1)
  ;; Second element
  2
  [{:a
    1
    :b
    2}
   4] ;; Third element

  ;; Comment

  {:foo
   [{}] ;; Inline
   :bar
   5}]) ;; Last element
`
}

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= sampleProgram.length || lineLength === 0)
    return `${sampleProgram}\n`

  if (lineLength >= 14) {
    return `
(flatten
 [1 2 [3 4] 5])
`.trimStart()
  }

  if (lineLength >= 7) {
    return `
(flatten
 [1
  2
  [3 4]
  5])
`.trimStart()
  }

  return `
(flatten
 [1
  2
  [3
   4]
  5])
`.trimStart()
}
