import { Lits } from '../src'
import { analyzeAst } from '../src/analyze'
import { builtin } from '../src/builtin'
import { createContextStack } from '../src/evaluator'
import { AstNode } from '../src/parser/interface'

describe(`analyzeAst.`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    test(`example`, () => {
      const program = `(+ a b)`
      const tokens = lits.tokenize(program)
      const ast = lits.parse(tokens)
      const astNode = ast.body[0] as AstNode
      const analyzeResult = analyzeAst(astNode, createContextStack(), builtin)
      expect(analyzeResult.undefinedSymbols).toEqual(new Set([`a`, `b`]))
    })
  }
})
