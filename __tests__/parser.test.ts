import { parseProgram } from '../src/parser'
import { tokenize } from '../src/tokenizer'

const program = `
(let ((day (* 24 60 60 1000)))
  (* days day)
)`

const optimizableProgram = `
(let ((day (* 24 60 60 1000)))
  (* 11 day)
)`

describe('Parser', () => {
  test('simple program', () => {
    const tokens = tokenize(program)
    const ast = parseProgram(tokens)
    // console.log(JSON.stringify(ast, null, 4))
    expect(ast.body.length).toBe(1)
  })
  test('empty program', () => {
    const tokens = tokenize('')
    const ast = parseProgram(tokens)
    expect(ast.body.length).toBe(0)
  })

  test('optimization', () => {
    const tokens = tokenize(optimizableProgram)
    const ast = parseProgram(tokens)
    expect(ast.body.length).toBe(1)
  })
})
