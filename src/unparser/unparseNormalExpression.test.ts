import { describe, expect, it } from 'vitest'
import { Lits } from '../Lits/Lits'
import { unparseAst } from './unparse'

const lits = new Lits({ debug: true })

describe('unparseNormalExpression', () => {
  it('should work 1', () => {
    const program = '(rand!)\n'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 2', () => {
    const program = `
(flatten (range
          10))
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 3', () => {
    const program = `
[(+ 1)]
`
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)

    expect(unparseAst(ast, 1)).toEqual(`
[(+
  1)]
`)
  })
})
