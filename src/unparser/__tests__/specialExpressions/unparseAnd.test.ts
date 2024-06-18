import { describe, expect, it } from 'vitest'
import { Lits } from '../../../Lits/Lits'
import { unparseAst } from '../../unparse'

const lits = new Lits({ debug: true })

describe('and', () => {
  it('should work 1', () => {
    const program = '(and)\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast)).toEqual(program)
  })

  it('should work 2', () => {
    const program = '(and foo bar)\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast)).toEqual(program)
  })

  it('should work 3', () => {
    const program = `
;; Leading comment
(and ;; Inline comment
 ;; Comment

 ;; Leading Comment
 foo ;; Inline comment
 ;; Leading Comment
 bar) ;; Inline comment
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast)).toEqual(program)
  })
})
