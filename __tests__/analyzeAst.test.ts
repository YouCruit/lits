import { Lits } from '../src'
import { findUndefinedSymbols } from '../src/analyze/undefinedSymbols'
import { builtin } from '../src/builtin'
import { createContextStack } from '../src/evaluator'
import { AstNode } from '../src/parser/interface'
import { getUndefinedSymbolNames } from './testUtils'

describe(`findUndefinedSymbols.`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    test(`example`, () => {
      const program = `(+ a b)`
      const tokens = lits.tokenize(program)
      const ast = lits.parse(tokens)
      const astNode = ast.body[0] as AstNode
      const analyzeResult = findUndefinedSymbols(astNode, createContextStack(), builtin)
      expect(getUndefinedSymbolNames(analyzeResult)).toEqual(new Set([`a`, `b`]))
    })
  }
})
