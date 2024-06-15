import { describe, expect, it } from 'vitest'
import { Lits } from '../Lits/Lits'
import { unparseAst } from './unparse'

const lits = new Lits({ debug: true })
const sampleProgram = '(flatten [1 2 [3 4] 5])'

describe('unparseArrayLitteral', () => {
  it('should work 1', () => {
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

  it('should work 2', () => {
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
    for (let lineLength = 1; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should work unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgram)
        const ast = lits.parse(tokenStream)
        expect(unparseAst(ast, lineLength)).toEqual(formatSampleProgram(lineLength))
      })
    }
  })
})

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= sampleProgram.length || lineLength === 0)
    return `${sampleProgram}\n`

  if (lineLength >= 14 || lineLength === 0) {
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
