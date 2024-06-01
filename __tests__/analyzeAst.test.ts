import { describe, expect, it } from 'vitest'
import { Lits } from '../src'
import { createContextStack } from '../src/Lits/Lits'
import { builtin } from '../src/builtin'
import type { Analysis } from '../src/analyze'
import { findUnresolvedIdentifiers } from '../src/analyze/findUnresolvedIdentifiers'
import { calculateOutcomes } from '../src/analyze/calculateOutcomes'
import { getUndefinedSymbolNames } from './testUtils'

describe('analyze', () => {
  describe('findUnresolvedIdentifiers.', () => {
    for (const lits of [new Lits(), new Lits({ debug: true })]) {
      it('example', () => {
        const program = '(+ a b)'
        const tokens = lits.tokenize(program)
        const ast = lits.parse(tokens)
        const analyzeResult: Analysis = {
          unresolvedIdentifiers: findUnresolvedIdentifiers(ast, createContextStack(), builtin),
          outcomes: new Set(),
        }
        expect(getUndefinedSymbolNames(analyzeResult)).toEqual(new Set(['a', 'b']))
      })
    }
  })
  describe('calculateOutcomes.', () => {
    const lits = new Lits()
    const testSamples: [string, null | unknown[]][] = [
      ['(if true "heads" "tails")', ['heads', 'tails']],
      ['(if false "heads" "tails")', ['heads', 'tails']],
      ['(str "heads" (if true :- :_) "tails")', ['heads-tails', 'heads_tails']],
      ['(str "heads" (if true x :_) "tails")', null],
      ['(write! :foo)', ['foo']],
      ['(cond 1 :1, 2 :2, 3 :3, :else :X)', ['1', '2', '3', 'X']],
      [`(let
          [x (cond 1 :1 2 :2 3 :3)
           y (if true :A :B)]
          (str x (when x y)))`, ['1A', '1B', '2A', '2B', '3A', '3B', '1', '2', '3']],
    ]

    testSamples.forEach(([program, expectedOutcomes]) => {
      it(`${program} -> ${JSON.stringify(expectedOutcomes)}`, () => {
        const tokens = lits.tokenize(program)
        const ast = lits.parse(tokens)
        if (expectedOutcomes === null)
          expect(calculateOutcomes(ast, {}, builtin)).toBeNull()
        else
          expect(calculateOutcomes(ast, {}, builtin)).toEqual(new Set(expectedOutcomes))
      })
    })
  })
})
