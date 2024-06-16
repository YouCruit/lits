import { describe, expect, it } from 'vitest'
import { Lits } from '../Lits/Lits'
import { unparseAst } from './unparse'

const lits = new Lits({ debug: true })
const sampleProgram = '(merge {:a 1, :b 2} {:foo {:x 42, :y 144}, :foobar {}})'

describe('unparseObjectLitteral', () => {
  it('should work 1', () => {
    const program = '{}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual('{}\n')
  })

  it('should work 2', () => {
    const program = '{:a {:x 1, :y 2, :z 3}}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 1)).toEqual(`
{:a {:x 1
     :y 2
     :z 3}}
`.trimStart())
  })

  it('should work 3', () => {
    const program = '{:a {:x 1, :y 2, :z 3}, :b {:x2 1, :y2 2, :z2 3}}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 1)).toEqual(`
{:a {:x 1
     :y 2
     :z 3}
 :b {:x2 1
     :y2 2
     :z2 3}}
`.trimStart())
  })

  describe('unparse program', () => {
    for (let lineLength = 0; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgram)
        const ast = lits.parse(tokenStream)
        const unparsed = unparseAst(ast, lineLength)
        expect(unparsed).toEqual(formatSampleProgram(lineLength))
      })
    }
  })
})

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= sampleProgram.length || lineLength === 0)
    return `${sampleProgram}\n`

  if (lineLength >= 42) {
    return `
(merge {:a 1, :b 2}
       {:foo {:x 42, :y 144}, :foobar {}})
`.trimStart()
  }

  if (lineLength >= 35) {
    return `
(merge
 {:a 1, :b 2}
 {:foo {:x 42, :y 144}, :foobar {}})
`.trimStart()
  }

  if (lineLength >= 22) {
    return `
(merge
 {:a 1, :b 2}
 {:foo {:x 42, :y 144}
  :foobar {}})
`.trimStart()
  }

  if (lineLength >= 13) {
    return `
(merge
 {:a 1, :b 2}
 {:foo {:x 42
        :y 144}
  :foobar {}})
`.trimStart()
  }

  return `
(merge
 {:a 1
  :b 2}
 {:foo {:x 42
        :y 144}
  :foobar {}})
`.trimStart()
}
