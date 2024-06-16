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
})
