import { describe, expect, it } from 'vitest'
import { Lits } from '../../Lits/Lits'
import { unparseAst } from '../unparse'

const lits = new Lits({ debug: true })
const sampleProgram = '(merge {:a 1, :b 2} {:foo {:x 42, :y 144}, :foobar {}})'
const sampleProgramWithComments = `
(merge
 ;; Fist object
 {:a 1, :b 2} ;; Inline comment
 ;; Second object
 {:foo ;; Key
  {:x 42 ;; Inline comment
   :y 144}

  ;; Add more here

  ;; Last key-value pair
  :foobar
  {}})
`

describe('unparseObjectLitteral', () => {
  it('should unparse empty object', () => {
    const program = '{}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual('{}\n')
  })

  it('should work 1', () => {
    const program = '{:x 1, :y 2, :z 3}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 12)).toEqual(`
{:x 1
 :y 2
 :z 3}
`.trimStart())
  })

  it('should work 2', () => {
    const program = '{:a {:x 1, :y 2, :z 3}}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 12)).toEqual(`
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
{:a
 {:x
  1
  :y
  2
  :z
  3}
 :b
 {:x2
  1
  :y2
  2
  :z2
  3}}
`.trimStart())
    expect(unparseAst(ast, 23)).toEqual(`
{:a {:x 1, :y 2, :z 3}
 :b {:x2 1
     :y2 2
     :z2 3}}
`.trimStart())
    expect(unparseAst(ast, 26)).toEqual(`
{:a {:x 1, :y 2, :z 3}
 :b {:x2 1, :y2 2, :z2 3}}
`.trimStart())
  })

  it('should work 4', () => {
    const program = `
{:foo ;; Key
 {:x 42 ;; Inline comment
  :y 144}}
`.trimStart()
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual(program)
  })

  it('should work 5', () => {
    const program = '{:foo 1 :bar 2}'
    const tokenStream = lits.tokenize(program)
    const ast = lits.parse(tokenStream)
    expect(unparseAst(ast, 80)).toEqual('{:foo 1, :bar 2}\n')
  })

  describe('unparse sample program.', () => {
    for (let lineLength = 0; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgram)
        const ast = lits.parse(tokenStream)
        const unparsed = unparseAst(ast, lineLength)
        expect(unparsed).toEqual(formatSampleProgram(lineLength))
      })
    }
  })

  describe('unparse sample program with comments.', () => {
    // for (let lineLength = 80; lineLength <= sampleProgramWithComments.length + 1; lineLength += 1) {
    for (let lineLength = 0; lineLength <= 80; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        const tokenStream = lits.tokenize(sampleProgramWithComments)
        const ast = lits.parse(tokenStream)
        const unparsed = unparseAst(ast, lineLength)
        expect(unparsed).toEqual(formatSampleProgramWithComments(lineLength))
      })
    }
  })
})

function formatSampleProgramWithComments(lineLength: number): string {
  if (lineLength >= 31 || lineLength === 0)
    return sampleProgramWithComments

  if (lineLength >= 26) {
    return `
(merge
 ;; Fist object
 {:a 1
  :b 2} ;; Inline comment
 ;; Second object
 {:foo ;; Key
  {:x 42 ;; Inline comment
   :y 144}

  ;; Add more here

  ;; Last key-value pair
  :foobar
  {}})
`
  }

  if (lineLength >= 25) {
    return `
(merge
 ;; Fist object
 {:a 1
  :b 2} ;; Inline comment
 ;; Second object
 {:foo ;; Key
  {:x
   42 ;; Inline comment
   :y
   144}

  ;; Add more here

  ;; Last key-value pair
  :foobar
  {}})
`
  }

  return `
(merge
 ;; Fist object
 {:a
  1
  :b
  2} ;; Inline comment
 ;; Second object
 {:foo ;; Key
  {:x
   42 ;; Inline comment
   :y
   144}

  ;; Add more here

  ;; Last key-value pair
  :foobar
  {}})
`
}

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

  if (lineLength >= 15) {
    return `
(merge
 {:a 1, :b 2}
 {:foo {:x 42
        :y 144}
  :foobar {}})
`.trimStart()
  }

  if (lineLength >= 13) {
    return `
(merge
 {:a 1, :b 2}
 {:foo {:x
        42
        :y
        144}
  :foobar {}})
`.trimStart()
  }

  if (lineLength >= 10) {
    return `
(merge
 {:a 1
  :b 2}
 {:foo
  {:x 42
   :y 144}
  :foobar
  {}})
`.trimStart()
  }

  if (lineLength >= 7) {
    return `
(merge
 {:a 1
  :b 2}
 {:foo
  {:x
   42
   :y
   144}
  :foobar
  {}})
`.trimStart()
  }

  return `
(merge
 {:a
  1
  :b
  2}
 {:foo
  {:x
   42
   :y
   144}
  :foobar
  {}})
`.trimStart()
}
