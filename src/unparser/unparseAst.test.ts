import { describe, expect, it } from 'vitest'
import { Lits } from '../Lits/Lits'
import { unparseAst } from './unparseAst'

const lits = new Lits({ debug: true })

describe('unparseAst', () => {
  it('should unparse ast', () => {
    const program = '(round (+ 1 2 (/ 3 4) 5))\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)

    expect(unparseAst(ast, 12)).toEqual(
`
(round
 (+
  1
  2
  (/ 3 4)
  5))
`.trimStart(),
    )

    expect(unparseAst(ast, 8)).toEqual(
`
(round
 (+
  1
  2
  (/
   3
   4)
  5))
`.trimStart(),
    )
  })

  it('should work 1', () => {
    const program = `
(+

 ;; B
 1
)
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 2', () => {
    const program = `
(+
 (- 1)
 1
)
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
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
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 4', () => {
    const program = `
(+
 ;; Comment

 1
)
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
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
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
  })
})
