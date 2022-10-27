import { Lits } from '../src'
import { analyzeAst } from '../src/analyze'
import { createContextStack } from '../src/evaluator'
import { AstNode } from '../src/parser/interface'

describe(`analyzeAst.`, () => {
  test(`example`, () => {
    const lits = new Lits()
    const program = `(+ a b)`
    const tokens = lits.tokenize(program)
    const ast = lits.parse(tokens)
    const astNode = ast.body[0] as AstNode
    const analyzeResult = analyzeAst(astNode, createContextStack())
    expect(analyzeResult.undefinedSymbols).toEqual(new Set([`a`, `b`]))
  })
})
