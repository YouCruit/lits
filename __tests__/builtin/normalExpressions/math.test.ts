import { Lits } from '../../../src'
import { MAX_NUMBER, MIN_NUMBER } from '../../../src/utils'
import { TestTypeEvaluation, testTypeEvaluations } from '../../testUtils'

const lits = new Lits()

describe(`math functions`, () => {
  // for (const lits of [new Lits(), new Lits({ debug: true })]) {
  describe(`inc`, () => {
    test(`samples`, () => {
      expect(lits.run(`(inc 2.5)`)).toBe(3.5)
      expect(lits.run(`(inc 1)`)).toBe(2)
      expect(lits.run(`(inc 0)`)).toBe(1)
      expect(lits.run(`(inc -1)`)).toBe(0)
      expect(lits.run(`(inc -2.5)`)).toBe(-1.5)
      expect(() => lits.run(`(inc)`)).toThrow()
      expect(() => lits.run(`(inc 1 1)`)).toThrow()
      expect(() => lits.run(`(inc :1)`)).toThrow()
      expect(() => lits.run(`(inc false)`)).toThrow()
      expect(() => lits.run(`(inc true)`)).toThrow()
      expect(() => lits.run(`(inc nil)`)).toThrow()
      expect(() => lits.run(`(inc boolean)`)).toThrow()
      expect(() => lits.run(`(inc [])`)).toThrow()
      expect(() => lits.run(`(inc (object))`)).toThrow()
    })
    describe(`inc dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`inc`, [`::unknown`], `ERROR`],

        [`inc`, [`::nan`], [`::nan`]],
        [`inc`, [`::positive-infinity`], [`::positive-infinity`]],
        [`inc`, [`::negative-infinity`], [`::negative-infinity`]],

        [`inc`, [`::zero`], [`::positive-integer`]],
        [`inc`, [`::float`], [`::float`, `::positive-infinity`]],
        [`inc`, [`::integer`], [`::integer`, `::positive-infinity`]],
        [`inc`, [`::non-zero-float`], [`::float`, `::positive-infinity`]],
        [`inc`, [`::non-zero-integer`], [`::integer`, `::positive-infinity`]],
        [`inc`, [`::positive-float`], [`::positive-float`, `::positive-infinity`]],
        [`inc`, [`::non-positive-float`], [`::float`]],
        [`inc`, [`::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`inc`, [`::non-positive-integer`], [`::integer`]],
        [`inc`, [`::negative-float`], [`::float`]],
        [`inc`, [`::non-negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`inc`, [`::negative-integer`], [`::non-positive-integer`]],
        [`inc`, [`::non-negative-integer`], [`::positive-integer`, `::positive-infinity`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`dec.`, () => {
    test(`samples.`, () => {
      expect(lits.run(`(dec 2.5)`)).toBe(1.5)
      expect(lits.run(`(dec 1)`)).toBe(0)
      expect(lits.run(`(dec 0)`)).toBe(-1)
      expect(lits.run(`(dec -1)`)).toBe(-2)
      expect(lits.run(`(dec -2.5)`)).toBe(-3.5)
      expect(() => lits.run(`(dec)`)).toThrow()
      expect(() => lits.run(`(dec 1 1)`)).toThrow()
      expect(() => lits.run(`(dec :1)`)).toThrow()
      expect(() => lits.run(`(dec false)`)).toThrow()
      expect(() => lits.run(`(dec true)`)).toThrow()
      expect(() => lits.run(`(dec nil)`)).toThrow()
      expect(() => lits.run(`(dec boolean)`)).toThrow()
      expect(() => lits.run(`(dec [])`)).toThrow()
      expect(() => lits.run(`(dec (object))`)).toThrow()
    })
    describe(`dec dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`dec`, [`::unknown`], `ERROR`],

        [`dec`, [`::nan`], [`::nan`]],
        [`dec`, [`::positive-infinity`], [`::positive-infinity`]],
        [`dec`, [`::negative-infinity`], [`::negative-infinity`]],

        [`dec`, [`::zero`], [`::negative-integer`]],
        [`dec`, [`::float`], [`::float`, `::negative-infinity`]],
        [`dec`, [`::integer`], [`::integer`, `::negative-infinity`]],
        [`dec`, [`::non-zero-float`], [`::float`, `::negative-infinity`]],
        [`dec`, [`::non-zero-integer`], [`::integer`, `::negative-infinity`]],
        [`dec`, [`::positive-float`], [`::float`]],
        [`dec`, [`::non-positive-float`], [`::negative-float`, `::negative-infinity`]],
        [`dec`, [`::positive-integer`], [`::non-negative-integer`]],
        [`dec`, [`::non-positive-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`dec`, [`::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`dec`, [`::non-negative-float`], [`::float`]],
        [`dec`, [`::negative-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`dec`, [`::non-negative-integer`], [`::integer`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`plus.`, () => {
    test(`samples.`, () => {
      expect(lits.run(`(+)`)).toBe(0)
      expect(lits.run(`(+ 2)`)).toBe(2)
      expect(lits.run(`(+ 2 2)`)).toBe(4)
      expect(lits.run(`(+ -2 2)`)).toBe(0)
      expect(lits.run(`(+ 1 2 3 4)`)).toBe(10)
      expect(() => lits.run(`(+ :1 2 3 4)`)).toThrow()
    })
    describe(`plus dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`+`, [`::unknown`, `::float`], `ERROR`],
        [`+`, [`::float`, `::unknown`], `ERROR`],

        [`+`, [`::illegal-number`], [`::illegal-number`]],
        [`+`, [`::nan`], [`::nan`]],
        [`+`, [`::positive-infinity`], [`::positive-infinity`]],
        [`+`, [`::negative-infinity`], [`::negative-infinity`]],
        [`+`, [`::zero`], [`::zero`]],
        [`+`, [`::float`], [`::float`]],
        [`+`, [`::integer`], [`::integer`]],
        [`+`, [`::non-zero-float`], [`::non-zero-float`]],
        [`+`, [`::non-zero-integer`], [`::non-zero-integer`]],
        [`+`, [`::positive-float`], [`::positive-float`]],
        [`+`, [`::non-positive-float`], [`::non-positive-float`]],
        [`+`, [`::positive-integer`], [`::positive-integer`]],
        [`+`, [`::non-positive-integer`], [`::non-positive-integer`]],
        [`+`, [`::negative-float`], [`::negative-float`]],
        [`+`, [`::non-negative-float`], [`::non-negative-float`]],
        [`+`, [`::negative-integer`], [`::negative-integer`]],
        [`+`, [`::non-negative-integer`], [`::non-negative-integer`]],

        [`+`, [`::illegal-number`, `::illegal-number`], [`::illegal-number`]],
        [`+`, [`::illegal-number`, `::nan`], [`::nan`]],
        [`+`, [`::illegal-number`, `::positive-infinity`], [`::positive-infinity`, `::nan`]],
        [`+`, [`::illegal-number`, `::negative-infinity`], [`::negative-infinity`, `::nan`]],
        [`+`, [`::illegal-number`, `::float`], [`::illegal-number`]],

        [`+`, [`::nan`, `::illegal-number`], [`::nan`]],
        [`+`, [`::nan`, `::nan`], [`::nan`]],
        [`+`, [`::nan`, `::positive-infinity`], [`::nan`]],
        [`+`, [`::nan`, `::negative-infinity`], [`::nan`]],
        [`+`, [`::nan`, `::float`], [`::nan`]],

        [`+`, [`::positive-infinity`, `::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`+`, [`::positive-infinity`, `::nan`], [`::nan`]],
        [`+`, [`::positive-infinity`, `::positive-infinity`], [`::positive-infinity`]],
        [`+`, [`::positive-infinity`, `::negative-infinity`], [`::nan`]],
        [`+`, [`::positive-infinity`, `::float`], [`::positive-infinity`]],

        [`+`, [`::negative-infinity`, `::illegal-number`], [`::negative-infinity`, `::nan`]],
        [`+`, [`::negative-infinity`, `::nan`], [`::nan`]],
        [`+`, [`::negative-infinity`, `::positive-infinity`], [`::nan`]],
        [`+`, [`::negative-infinity`, `::negative-infinity`], [`::negative-infinity`]],
        [`+`, [`::negative-infinity`, `::float`], [`::negative-infinity`]],

        [`+`, [`::zero`, `::zero`], [`::zero`]],
        [`+`, [`::zero`, `::integer`], [`::integer`]],
        [`+`, [`::zero`, `::positive-integer`], [`::positive-integer`]],
        [`+`, [`::zero`, `::positive-float`], [`::positive-float`]],
        [`+`, [`::zero`, `::positive-infinity`], [`::positive-infinity`]],

        [`+`, [`::positive-float`, `::zero`], [`::positive-float`]],
        [`+`, [`::positive-float`, `::positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`+`, [`::positive-float`, `::non-positive-integer`], [`::float`]],
        [`+`, [`::positive-float`, `::negative-float`], [`::float`]],
        [`+`, [`::positive-float`, `::positive-float`], [`::positive-float`, `::positive-infinity`]],
        [`+`, [`::positive-float`, `::positive-infinity`], [`::positive-infinity`]],

        [`+`, [`::positive-integer`, `::zero`], [`::positive-integer`]],
        [`+`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::positive-integer`, `::non-negative-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::positive-integer`, `::negative-float`], [`::float`]],
        [`+`, [`::positive-integer`, `::negative-integer`], [`::integer`]],
        [`+`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::positive-integer`, `::negative-infinity`], [`::negative-infinity`]],

        [`+`, [`::negative-integer`, `::zero`], [`::negative-integer`]],
        [`+`, [`::negative-integer`, `::positive-integer`], [`::integer`]],
        [`+`, [`::negative-integer`, `::non-negative-integer`], [`::integer`]],
        [`+`, [`::negative-integer`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`+`, [`::negative-integer`, `::negative-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`+`, [`::negative-integer`, `::illegal-number`], [`::illegal-number`]],

        [`+`, [`::negative-float`, `::zero`], [`::negative-float`]],
        [`+`, [`::negative-float`, `::positive-integer`], [`::float`]],
        [`+`, [`::negative-float`, `::non-positive-integer`], [`::negative-float`, `::negative-infinity`]],
        [`+`, [`::negative-float`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`+`, [`::negative-float`, `::negative-infinity`], [`::negative-infinity`]],

        [`+`, [`::non-negative-integer`, `::zero`], [`::non-negative-integer`]],
        [`+`, [`::non-negative-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::non-negative-integer`, `::non-negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`+`, [`::non-negative-integer`, `::negative-float`], [`::float`]],
        [`+`, [`::non-negative-integer`, `::negative-integer`], [`::integer`]],
        [`+`, [`::non-negative-integer`, `::nan`], [`::nan`]],

        [`+`, [`::non-positive-float`, `::zero`], [`::non-positive-float`]],
        [`+`, [`::non-positive-float`, `::positive-integer`], [`::float`]],
        [`+`, [`::non-positive-float`, `::non-positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`+`, [`::non-positive-float`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`+`, [`::non-positive-float`, `::illegal-number`], [`::illegal-number`]],

        [`+`, [`::non-positive-integer`, `::zero`], [`::non-positive-integer`]],
        [`+`, [`::non-positive-integer`, `::positive-integer`], [`::integer`]],
        [`+`, [`::non-positive-integer`, `::non-negative-integer`], [`::integer`]],
        [`+`, [`::non-positive-integer`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`+`, [`::non-positive-integer`, `::negative-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`+`, [`::non-positive-integer`, `::positive-infinity`], [`::positive-infinity`]],

        [`+`, [`::non-negative-float`, `::zero`], [`::non-negative-float`]],
        [`+`, [`::non-negative-float`, `::positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`+`, [`::non-negative-float`, `::non-positive-integer`], [`::float`]],
        [`+`, [`::non-negative-float`, `::negative-float`], [`::float`]],
        [`+`, [`::non-negative-float`, `::negative-infinity`], [`::negative-infinity`]],

        [`+`, [`::integer`, `::zero`], [`::integer`]],
        [`+`, [`::integer`, `::integer`], [`::integer`, `::infinity`]],
        [`+`, [`::integer`, `::positive-integer`], [`::integer`, `::positive-infinity`]],
        [`+`, [`::integer`, `::non-negative-integer`], [`::integer`, `::positive-infinity`]],
        [`+`, [`::integer`, `::negative-float`], [`::float`, `::negative-infinity`]],
        [`+`, [`::integer`, `::negative-integer`], [`::integer`, `::negative-infinity`]],
        [`+`, [`::integer`, `::nan`], [`::nan`]],

        [`+`, [`::float`, `::zero`], [`::float`]],
        [`+`, [`::float`, `::positive-integer`], [`::float`, `::positive-infinity`]],
        [`+`, [`::float`, `::non-negative-integer`], [`::float`, `::positive-infinity`]],
        [`+`, [`::float`, `::negative-float`], [`::float`, `::negative-infinity`]],
        [`+`, [`::float`, `::negative-integer`], [`::float`, `::negative-infinity`]],
        [`+`, [`::float`, `::positive-float`], [`::float`, `::positive-infinity`]],
      ]
      testTypeEvaluations(lits, typeEvaluations, `commutativeParams`)
    })
  })

  describe(`minus.`, () => {
    test(`samples.`, () => {
      expect(lits.run(`(-)`)).toBe(0)
      expect(lits.run(`(- 2)`)).toBe(-2)
      expect(lits.run(`(- 2 2)`)).toBe(2 - 2)
      expect(lits.run(`(- -2 2)`)).toBe(-2 - 2)
      expect(lits.run(`(- 1 2 3 4)`)).toBe(1 - 2 - 3 - 4)
      expect(() => lits.run(`(- :1 2 3 4)`)).toThrow()
    })
    test(`strange bug on minus`, () => {
      expect(lits.run(`(def a 0) (def b 2) (- a b)`)).toBe(-2)
    })
    describe(`minus dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`-`, [`::unknown`, `::float`], `ERROR`],
        [`-`, [`::float`, `::unknown`], `ERROR`],

        [`-`, [], { expression: `0` }],

        [`-`, [`::illegal-number`], [`::illegal-number`]],
        [`-`, [`::nan`], [`::nan`]],
        [`-`, [`::positive-infinity`], [`::negative-infinity`]],
        [`-`, [`::negative-infinity`], [`::positive-infinity`]],

        [`-`, [`::zero`], [`::zero`]],
        [`-`, [`::float`], [`::float`]],
        [`-`, [`::integer`], [`::integer`]],
        [`-`, [`::non-zero-float`], [`::non-zero-float`]],
        [`-`, [`::non-zero-integer`], [`::non-zero-integer`]],
        [`-`, [`::positive-float`], [`::negative-float`]],
        [`-`, [`::non-positive-float`], [`::non-negative-float`]],
        [`-`, [`::positive-integer`], [`::negative-integer`]],
        [`-`, [`::non-positive-integer`], [`::non-negative-integer`]],
        [`-`, [`::negative-float`], [`::positive-float`]],
        [`-`, [`::non-negative-float`], [`::non-positive-float`]],
        [`-`, [`::negative-integer`], [`::positive-integer`]],
        [`-`, [`::non-negative-integer`], [`::non-positive-integer`]],

        [`-`, [`::illegal-number`, `::illegal-number`], [`::illegal-number`]],
        [`-`, [`::illegal-number`, `::nan`], [`::nan`]],
        [`-`, [`::illegal-number`, `::positive-infinity`], [`::negative-infinity`, `::nan`]],
        [`-`, [`::illegal-number`, `::negative-infinity`], [`::positive-infinity`, `::nan`]],
        [`-`, [`::illegal-number`, `::float`], [`::illegal-number`]],

        [`-`, [`::nan`, `::illegal-number`], [`::nan`]],
        [`-`, [`::nan`, `::nan`], [`::nan`]],
        [`-`, [`::nan`, `::positive-infinity`], [`::nan`]],
        [`-`, [`::nan`, `::negative-infinity`], [`::nan`]],
        [`-`, [`::nan`, `::float`], [`::nan`]],

        [`-`, [`::positive-infinity`, `::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`-`, [`::positive-infinity`, `::nan`], [`::nan`]],
        [`-`, [`::positive-infinity`, `::positive-infinity`], [`::nan`]],
        [`-`, [`::positive-infinity`, `::negative-infinity`], [`::positive-infinity`]],
        [`-`, [`::positive-infinity`, `::float`], [`::positive-infinity`]],

        [`-`, [`::negative-infinity`, `::illegal-number`], [`::negative-infinity`, `::nan`]],
        [`-`, [`::negative-infinity`, `::nan`], [`::nan`]],
        [`-`, [`::negative-infinity`, `::positive-infinity`], [`::negative-infinity`]],
        [`-`, [`::negative-infinity`, `::negative-infinity`], [`::nan`]],
        [`-`, [`::negative-infinity`, `::float`], [`::negative-infinity`]],

        [`-`, [`::zero`, `::zero`], [`::zero`]],
        [`-`, [`::zero`, `::integer`], [`::integer`]],
        [`-`, [`::zero`, `::positive-integer`], [`::negative-integer`]],
        [`-`, [`::zero`, `::positive-float`], [`::negative-float`]],

        [`-`, [`::positive-float`, `::zero`], [`::positive-float`]],
        [`-`, [`::positive-float`, `::positive-integer`], [`::float`]],
        [`-`, [`::positive-float`, `::non-positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`-`, [`::positive-float`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],

        [`-`, [`::positive-integer`, `::zero`], [`::positive-integer`]],
        [`-`, [`::positive-integer`, `::positive-integer`], [`::integer`]],
        [`-`, [`::positive-integer`, `::non-negative-integer`], [`::integer`]],
        [`-`, [`::positive-integer`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`-`, [`::positive-integer`, `::negative-integer`], [`::positive-integer`, `::positive-infinity`]],

        [`-`, [`::negative-integer`, `::zero`], [`::negative-integer`]],
        [`-`, [`::negative-integer`, `::positive-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`-`, [`::negative-integer`, `::non-negative-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`-`, [`::negative-integer`, `::negative-float`], [`::float`]],
        [`-`, [`::negative-integer`, `::negative-integer`], [`::integer`]],

        [`-`, [`::negative-float`, `::zero`], [`::negative-float`]],
        [`-`, [`::negative-float`, `::positive-integer`], [`::negative-float`, `::negative-infinity`]],
        [`-`, [`::negative-float`, `::non-positive-integer`], [`::float`]],
        [`-`, [`::negative-float`, `::negative-float`], [`::float`]],

        [`-`, [`::non-negative-integer`, `::zero`], [`::non-negative-integer`]],
        [`-`, [`::non-negative-integer`, `::positive-integer`], [`::integer`]],
        [`-`, [`::non-negative-integer`, `::non-negative-integer`], [`::integer`]],
        [`-`, [`::non-negative-integer`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`-`, [`::non-negative-integer`, `::negative-integer`], [`::positive-integer`, `::positive-infinity`]],

        [`-`, [`::non-positive-float`, `::zero`], [`::non-positive-float`]],
        [`-`, [`::non-positive-float`, `::positive-integer`], [`::negative-float`, `::negative-infinity`]],
        [`-`, [`::non-positive-float`, `::non-positive-integer`], [`::float`]],
        [`-`, [`::non-positive-float`, `::negative-float`], [`::float`]],

        [`-`, [`::non-positive-integer`, `::zero`], [`::non-positive-integer`]],
        [`-`, [`::non-positive-integer`, `::positive-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`-`, [`::non-positive-integer`, `::non-negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`-`, [`::non-positive-integer`, `::non-positive-integer`], [`::integer`]],
        [`-`, [`::non-positive-integer`, `::negative-float`], [`::float`]],
        [`-`, [`::non-positive-integer`, `::negative-integer`], [`::integer`]],

        [`-`, [`::non-negative-float`, `::zero`], [`::non-negative-float`]],
        [`-`, [`::non-negative-float`, `::positive-integer`], [`::float`]],
        [`-`, [`::non-negative-float`, `::non-positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`-`, [`::non-negative-float`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],

        [`-`, [`::integer`, `::zero`], [`::integer`]],
        [`-`, [`::integer`, `::positive-integer`], [`::integer`, `::negative-infinity`]],
        [`-`, [`::integer`, `::non-negative-integer`], [`::integer`, `::negative-infinity`]],
        [`-`, [`::integer`, `::negative-float`], [`::float`, `::positive-infinity`]],
        [`-`, [`::integer`, `::negative-integer`], [`::integer`, `::positive-infinity`]],
        [`-`, [`::integer`, `::integer`], [`::integer`, `::infinity`]],

        [`-`, [`::float`, `::zero`], [`::float`]],
        [`-`, [`::float`, `::float`], [`::float`, `::infinity`]],
        [`-`, [`::float`, `::positive-integer`], [`::float`, `::negative-infinity`]],
        [`-`, [`::float`, `::non-negative-integer`], [`::float`, `::negative-infinity`]],
        [`-`, [`::float`, `::negative-float`], [`::float`, `::positive-infinity`]],
        [`-`, [`::float`, `::negative-integer`], [`::float`, `::positive-infinity`]],
      ]
      testTypeEvaluations(lits, typeEvaluations, `commutativeRestParams`)
    })
  })

  describe(`multiplication.`, () => {
    test(`samples.`, () => {
      expect(lits.run(`(*)`)).toBe(1)
      expect(lits.run(`(* 2)`)).toBe(2)
      expect(lits.run(`(* 2 2)`)).toBe(4)
      expect(lits.run(`(* -2 2)`)).toBe(-4)
      expect(lits.run(`(* 1 2 3 4)`)).toBe(24)
      expect(() => lits.run(`(* :1 2 3 4)`)).toThrow()
    })
    describe(`multiplication dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`*`, [`::unknown`, `::float`], `ERROR`],
        [`*`, [`::float`, `::unknown`], `ERROR`],

        [`*`, [`::illegal-number`], [`::illegal-number`]],
        [`*`, [`::zero`], [`::zero`]],
        [`*`, [`::float`], [`::float`]],
        [`*`, [`::integer`], [`::integer`]],
        [`*`, [`::non-zero-float`], [`::non-zero-float`]],
        [`*`, [`::non-zero-integer`], [`::non-zero-integer`]],
        [`*`, [`::positive-float`], [`::positive-float`]],
        [`*`, [`::non-positive-float`], [`::non-positive-float`]],
        [`*`, [`::positive-integer`], [`::positive-integer`]],
        [`*`, [`::non-positive-integer`], [`::non-positive-integer`]],
        [`*`, [`::negative-float`], [`::negative-float`]],
        [`*`, [`::non-negative-float`], [`::non-negative-float`]],
        [`*`, [`::negative-integer`], [`::negative-integer`]],
        [`*`, [`::non-negative-integer`], [`::non-negative-integer`]],

        [`*`, [`::illegal-number`, `::zero`], [`::zero`]],
        [`*`, [`::illegal-number`, `::non-zero-float`], [`::positive-infinity`, `::negative-infinity`, `::nan`]],
        [`*`, [`::illegal-number`, `::illegal-number`], [`::illegal-number`]],

        [`*`, [`::zero`, `::illegal-number`], [`::zero`]],
        [`*`, [`::zero`, `::zero`], [`::zero`]],
        [`*`, [`::zero`, `::integer`], [`::zero`]],
        [`*`, [`::zero`, `::positive-integer`], [`::zero`]],
        [`*`, [`::zero`, `::positive-float`], [`::zero`]],

        [`*`, [`::positive-float`, `::zero`], [`::zero`]],
        [`*`, [`::positive-float`, `::positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`*`, [`::positive-float`, `::non-positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::positive-float`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],

        [`*`, [`::positive-integer`, `::zero`], [`::zero`]],
        [`*`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`*`, [`::positive-integer`, `::non-negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`*`, [`::positive-integer`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`*`, [`::positive-integer`, `::negative-integer`], [`::negative-integer`, `::negative-infinity`]],

        [`*`, [`::negative-integer`, `::zero`], [`::zero`]],
        [`*`, [`::negative-integer`, `::positive-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`*`, [`::negative-integer`, `::non-negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`*`, [`::negative-integer`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`*`, [`::negative-integer`, `::negative-integer`], [`::positive-integer`, `::positive-infinity`]],

        [`*`, [`::negative-float`, `::zero`], [`::zero`]],
        [`*`, [`::negative-float`, `::positive-integer`], [`::negative-float`, `::negative-infinity`]],
        [`*`, [`::negative-float`, `::non-positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::negative-float`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],

        [`*`, [`::non-negative-integer`, `::zero`], [`::zero`]],
        [`*`, [`::non-negative-integer`, `::positive-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`*`, [`::non-negative-integer`, `::non-negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`*`, [`::non-negative-integer`, `::negative-float`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::non-negative-integer`, `::negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],

        [`*`, [`::non-positive-float`, `::zero`], [`::zero`]],
        [`*`, [`::non-positive-float`, `::positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::non-positive-float`, `::non-positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::non-positive-float`, `::negative-float`], [`::non-negative-float`, `::positive-infinity`]],

        [`*`, [`::non-positive-integer`, `::zero`], [`::zero`]],
        [`*`, [`::non-positive-integer`, `::positive-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`*`, [`::non-positive-integer`, `::non-negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`*`, [`::non-positive-integer`, `::negative-float`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::non-positive-integer`, `::negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],

        [`*`, [`::non-negative-float`, `::zero`], [`::zero`]],
        [`*`, [`::non-negative-float`, `::positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::non-negative-float`, `::non-positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::non-negative-float`, `::negative-float`], [`::non-positive-float`, `::negative-infinity`]],

        [`*`, [`::integer`, `::zero`], [`::zero`]],
        [`*`, [`::integer`, `::positive-integer`], [`::integer`, `::infinity`]],
        [`*`, [`::integer`, `::non-negative-integer`], [`::integer`, `::infinity`]],
        [`*`, [`::integer`, `::negative-float`], [`::float`, `::infinity`]],
        [`*`, [`::integer`, `::negative-integer`], [`::integer`, `::infinity`]],

        [`*`, [`::float`, `::zero`], [`::zero`]],
        [`*`, [`::float`, `::positive-integer`], [`::float`, `::infinity`]],
        [`*`, [`::float`, `::non-negative-integer`], [`::float`, `::infinity`]],
        [`*`, [`::float`, `::negative-float`], [`::float`, `::infinity`]],
        [`*`, [`::float`, `::negative-integer`], [`::float`, `::infinity`]],
      ]
      testTypeEvaluations(lits, typeEvaluations, `commutativeParams`)
    })
  })

  describe(`division.`, () => {
    test(`samples.`, () => {
      expect(lits.run(`(/)`)).toBe(1)
      expect(lits.run(`(/ 2)`)).toBe(1 / 2)
      expect(lits.run(`(/ 2 2)`)).toBe(2 / 2)
      expect(lits.run(`(/ -2 2)`)).toBe(-2 / 2)
      expect(lits.run(`(/ 1 2 3 4)`)).toBe(1 / 2 / 3 / 4)
      expect(() => lits.run(`(/ :1 2 3 4)`)).toThrow()
    })
    describe(`division dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`/`, [`::unknown`, `::float`], `ERROR`],
        [`/`, [`::float`, `::unknown`], `ERROR`],

        [`/`, [`::zero`], [`::positive-infinity`]],
        [`/`, [`::positive-infinity`], [`::zero`]],
        [`/`, [`::negative-infinity`], [`::zero`]],
        [`/`, [`::float`], [`::non-zero-float`, `::infinity`]],
        [`/`, [`::integer`], [`::non-zero-float`, `::positive-infinity`]],
        [`/`, [`::non-zero-float`], [`::non-zero-float`, `::infinity`]],
        [`/`, [`::non-zero-integer`], [`::non-zero-float`]],
        [`/`, [`::positive-float`], [`::positive-float`, `::positive-infinity`]],
        [`/`, [`::non-positive-float`], [`::negative-float`, `::infinity`]],
        [`/`, [`::positive-integer`], [`::positive-float`]],
        [`/`, [`::non-positive-integer`], [`::negative-float`, `::positive-infinity`]],
        [`/`, [`::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`/`, [`::non-negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`/`, [`::negative-integer`], [`::negative-float`]],
        [`/`, [`::non-negative-integer`], [`::positive-float`, `::positive-infinity`]],

        [`/`, [`::illegal-number`, `::zero`], [`::illegal-number`]],
        [`/`, [`::illegal-number`, `::illegal-number`], [`::nan`, `::zero`]],
        [`/`, [`::positive-infinity`, `::zero`], [`::positive-infinity`]],
        [`/`, [`::negative-infinity`, `::zero`], [`::negative-infinity`]],
        [`/`, [`::illegal-number`, `::non-zero-float`], [`::illegal-number`]],

        [`/`, [`::zero`, `::zero`], [`::zero`]],
        [`/`, [`::zero`, `::integer`], [`::zero`]],
        [`/`, [`::zero`, `::positive-integer`], [`::zero`]],
        [`/`, [`::zero`, `::positive-float`], [`::zero`]],

        [`/`, [`::positive-float`, `::zero`], [`::positive-infinity`]],
        [`/`, [`::positive-float`, `::positive-integer`], [`::positive-float`]],
        [`/`, [`::positive-float`, `::non-positive-integer`], [`::positive-infinity`, `::negative-float`]],
        [`/`, [`::positive-float`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],

        [`/`, [`::positive-integer`, `::positive-infinity`], [`::zero`]],
        [`/`, [`::positive-integer`, `::positive-integer`], [`::positive-float`]],
        [`/`, [`::positive-integer`, `::non-negative-integer`], [`::positive-infinity`, `::positive-float`]],
        [`/`, [`::positive-integer`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`/`, [`::positive-integer`, `::negative-integer`], [`::negative-float`]],

        [`/`, [`::negative-integer`, `::zero`], [`::negative-infinity`]],
        [`/`, [`::negative-integer`, `::positive-integer`], [`::negative-float`]],
        [`/`, [`::negative-integer`, `::non-negative-integer`], [`::negative-float`, `::negative-infinity`]],
        [`/`, [`::negative-integer`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`/`, [`::negative-integer`, `::negative-integer`], [`::positive-float`]],

        [`/`, [`::negative-float`, `::zero`], [`::negative-infinity`]],
        [`/`, [`::negative-float`, `::positive-integer`], [`::negative-float`]],
        [`/`, [`::negative-float`, `::non-positive-integer`], [`::positive-float`, `::negative-infinity`]],
        [`/`, [`::negative-float`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [
          `/`,
          [`::negative-integer`, `::positive-integer`, `::positive-integer`, `::negative-integer`],
          [`::positive-float`],
        ],

        [`/`, [`::non-negative-integer`, `::zero`], [`::zero`, `::positive-infinity`]],
        [`/`, [`::non-negative-integer`, `::positive-integer`], [`::non-negative-float`]],
        [
          `/`,
          [`::non-negative-integer`, `::non-negative-integer`],
          [`::zero`, `::positive-infinity`, `::non-negative-float`],
        ],
        [`/`, [`::non-negative-integer`, `::negative-float`], [`::non-positive-float`, `::negative-infinity`]],
        [`/`, [`::non-negative-integer`, `::negative-integer`], [`::non-positive-float`]],

        [`/`, [`::non-positive-float`, `::zero`], [`::zero`, `::negative-infinity`]],
        [`/`, [`::non-positive-float`, `::positive-integer`], [`::non-positive-float`]],
        [
          `/`,
          [`::non-positive-float`, `::non-positive-integer`],
          [`::non-negative-float`, `::zero`, `::negative-infinity`],
        ],
        [`/`, [`::non-positive-float`, `::negative-float`], [`::non-negative-float`, `::positive-infinity`]],

        [`/`, [`::non-positive-integer`, `::zero`], [`::zero`, `::negative-infinity`]],
        [`/`, [`::non-positive-integer`, `::positive-integer`], [`::non-positive-float`]],
        [
          `/`,
          [`::non-positive-integer`, `::non-negative-integer`],
          [`::zero`, `::non-positive-float`, `::negative-infinity`],
        ],
        [`/`, [`::non-positive-integer`, `::negative-float`], [`::non-negative-float`, `::positive-infinity`]],
        [`/`, [`::non-positive-integer`, `::negative-integer`], [`::non-negative-float`]],

        [`/`, [`::non-negative-float`, `::zero`], [`::zero`, `::positive-infinity`]],
        [`/`, [`::non-negative-float`, `::positive-integer`], [`::non-negative-float`]],
        [`/`, [`::non-negative-float`, `::non-positive-integer`], [`::non-positive-float`, `::positive-infinity`]],
        [`/`, [`::non-negative-float`, `::negative-float`], [`::non-positive-float`, `::negative-infinity`]],

        [`/`, [`::integer`, `::zero`], [`::zero`, `::infinity`]],
        [`/`, [`::integer`, `::positive-integer`], [`::float`]],
        [`/`, [`::integer`, `::non-negative-integer`], [`::infinity`, `::float`]],
        [`/`, [`::integer`, `::negative-float`], [`::float`, `::infinity`]],
        [`/`, [`::integer`, `::negative-integer`], [`::float`]],

        [`/`, [`::float`, `::zero`], [`::zero`, `::infinity`]],
        [`/`, [`::float`, `::positive-integer`], [`::float`]],
        [`/`, [`::float`, `::non-negative-integer`], [`::infinity`, `::float`]],
        [`/`, [`::float`, `::negative-float`], [`::float`, `::infinity`]],
        [`/`, [`::float`, `::negative-integer`], [`::float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations, `commutativeRestParams`)
    })
  })

  describe(`sqrt`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(sqrt)`)).toThrow()
      expect(() => lits.run(`(sqrt 3 4)`)).toThrow()
      expect(lits.run(`(sqrt -3)`)).toBeNaN()
      expect(lits.run(`(sqrt 0)`)).toBe(0)
      expect(lits.run(`(sqrt 1)`)).toBe(1)
      expect(lits.run(`(sqrt 4)`)).toBe(2)
    })
    describe(`sqrt dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`sqrt`, [`::unknown`], `ERROR`],

        [`sqrt`, [`::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`sqrt`, [`::nan`], [`::nan`]],
        [`sqrt`, [`::positive-infinity`], [`::positive-infinity`]],
        [`sqrt`, [`::negative-infinity`], [`::nan`]],
        [`sqrt`, [`::zero`], [`::zero`]],
        [`sqrt`, [`::float`], [`::non-negative-float`, `::nan`]],
        [`sqrt`, [`::integer`], [`::non-negative-float`, `::nan`]],
        [`sqrt`, [`::non-zero-float`], [`::positive-float`, `::nan`]],
        [`sqrt`, [`::non-zero-integer`], [`::positive-float`, `::nan`]],
        [`sqrt`, [`::positive-float`], [`::positive-float`]],
        [`sqrt`, [`::non-positive-float`], [`::nan`, `::zero`]],
        [`sqrt`, [`::positive-integer`], [`::positive-float`]],
        [`sqrt`, [`::non-positive-integer`], [`::nan`, `::zero`]],
        [`sqrt`, [`::negative-float`], [`::nan`]],
        [`sqrt`, [`::non-negative-float`], [`::non-negative-float`]],
        [`sqrt`, [`::negative-integer`], [`::nan`]],
        [`sqrt`, [`::non-negative-integer`], [`::non-negative-float`]],

        [`sqrt`, [[`::non-negative-float`, `::nan`]], [`::non-negative-float`, `::nan`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`cbrt`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(cbrt)`)).toThrow()
      expect(() => lits.run(`(cbrt 3 4)`)).toThrow()
      expect(lits.run(`(cbrt -8)`)).toBe(-2)
      expect(lits.run(`(cbrt 0)`)).toBe(0)
      expect(lits.run(`(cbrt 1)`)).toBe(1)
      expect(lits.run(`(cbrt 8)`)).toBe(2)
      expect(lits.run(`(cbrt 12)`)).toBe(Math.cbrt(12))
    })
    describe(`cbrt dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`cbrt`, [`::unknown`], `ERROR`],

        [`cbrt`, [`::positive-infinity`], [`::positive-infinity`]],
        [`cbrt`, [`::negative-infinity`], [`::negative-infinity`]],
        [`cbrt`, [`::nan`], [`::nan`]],
        [`cbrt`, [`::zero`], [`::zero`]],
        [`cbrt`, [`::float`], [`::float`]],
        [`cbrt`, [`::integer`], [`::float`]],
        [`cbrt`, [`::non-zero-float`], [`::non-zero-float`]],
        [`cbrt`, [`::non-zero-integer`], [`::non-zero-float`]],
        [`cbrt`, [`::positive-float`], [`::positive-float`]],
        [`cbrt`, [`::non-positive-float`], [`::non-positive-float`]],
        [`cbrt`, [`::positive-integer`], [`::positive-float`]],
        [`cbrt`, [`::non-positive-integer`], [`::non-positive-float`]],
        [`cbrt`, [`::negative-float`], [`::negative-float`]],
        [`cbrt`, [`::non-negative-float`], [`::non-negative-float`]],
        [`cbrt`, [`::negative-integer`], [`::negative-float`]],
        [`cbrt`, [`::non-negative-integer`], [`::non-negative-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`pow`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(pow)`)).toThrow()
      expect(() => lits.run(`(pow 3)`)).toThrow()
      expect(() => lits.run(`(pow 3 4 5)`)).toThrow()
      expect(lits.run(`(pow 2 0)`)).toBe(1)
      expect(lits.run(`(pow 2 1)`)).toBe(2)
      expect(lits.run(`(pow 2 2)`)).toBe(4)
      expect(lits.run(`(pow 2 3)`)).toBe(8)
      expect(lits.run(`(pow 16 0.5)`)).toBe(4)
      expect(lits.run(`(pow 10 -1)`)).toBe(0.1)
      expect(lits.run(`(pow 10 -2)`)).toBe(0.01)
      expect(lits.run(`(pow -2 -1)`)).toBe(-0.5)
      expect(lits.run(`(pow -2 -2)`)).toBe(0.25)
    })
    describe(`pow dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`pow`, [`::unknown`, `::positive-integer`], `ERROR`],
        [`pow`, [`::positive-integer`, `::unknown`], `ERROR`],

        [`pow`, [`::float`, `::nan`], [`::nan`]],
        [`pow`, [`::nan`, `::float`], [`::nan`, `::positive-integer`]],
        [`pow`, [`::nan`, `::nan`], [`::nan`]],

        [`pow`, [`::illegal-number`, `::illegal-number`], [`::positive-infinity`, `::nan`, `::zero`]],

        [`pow`, [`::positive-infinity`, `::positive-infinity`], [`::positive-infinity`]],
        [`pow`, [`::positive-infinity`, `::negative-infinity`], [`::zero`]],
        [`pow`, [`::positive-infinity`, `::float`], [`::non-negative-integer`, `::positive-infinity`]],
        [`pow`, [`::positive-infinity`, `::negative-float`], [`::zero`]],

        [`pow`, [`::negative-infinity`, `::positive-infinity`], [`::positive-infinity`]],
        [`pow`, [`::negative-infinity`, `::negative-infinity`], [`::zero`]],
        [
          `pow`,
          [`::negative-infinity`, `::float`],
          [`::zero`, `::positive-integer`, `::positive-infinity`, `::negative-infinity`],
        ],
        [`pow`, [`::negative-infinity`, `::negative-float`], [`::zero`]],

        [`pow`, [`::float`, `::float`], [`::illegal-number`, `::float`]],
        [`pow`, [`::float`, `::illegal-number`], [`::non-negative-integer`, `::nan`, `::positive-infinity`]],

        [`pow`, [`::integer`, `::zero`], [`::positive-integer`]],
        [`pow`, [`::integer`, `::positive-float`], [`::illegal-number`, `::non-negative-float`, `::negative-integer`]],
        [`pow`, [`::integer`, `::negative-float`], [`::nan`, `::float`, `::positive-infinity`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`round`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(round)`)).toThrow()
      expect(() => lits.run(`(round 3 4 5)`)).toThrow()
      expect(lits.run(`(round 0)`)).toBe(0)
      expect(lits.run(`(round 1)`)).toBe(1)
      expect(lits.run(`(round 0.4)`)).toBe(0)
      expect(lits.run(`(round 0.5)`)).toBe(1)
      expect(lits.run(`(round 0.6)`)).toBe(1)
      expect(lits.run(`(round -0.4)`)).toBe(-0)
      expect(lits.run(`(round -0.5)`)).toBe(-0)
      expect(lits.run(`(round -0.6)`)).toBe(-1)
      expect(lits.run(`(round -0.125 1)`)).toBe(-0.1)
      expect(lits.run(`(round 0.125 2)`)).toBe(0.13)
    })
    describe(`round dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`round`, [`::unknown`], `ERROR`],

        [`round`, [`::positive-infinity`], [`::positive-infinity`]],
        [`round`, [`::negative-infinity`], [`::negative-infinity`]],
        [`round`, [`::nan`], [`::nan`]],
        [`round`, [`::positive-infinity`, `::positive-infinity`], `ERROR`],
        [`round`, [`::negative-infinity`, `::negative-infinity`], `ERROR`],
        [`round`, [`::nan`, `::nan`], `ERROR`],
        [`round`, [`::illegal-number`, `::illegal-number`], `ERROR`],

        [`round`, [`::float`], [`::integer`]],
        [`round`, [`::positive-float`], [`::non-negative-integer`]],
        [`round`, [`::positive-integer`], [`::positive-integer`]],
        [`round`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`round`, [`::negative-float`], [`::non-positive-integer`]],
        [`round`, [`::non-negative-float`], [`::non-negative-integer`]],

        [`round`, [`::float`, `::float`], `ERROR`],
        [`round`, [`::float`, `::non-negative-integer`], [`::float`]],
        [`round`, [`::positive-float`, `::positive-integer`], [`::non-negative-float`]],
        [`round`, [`::negative-float`, `::positive-integer`], [`::non-positive-float`]],
        [`round`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`]],
        [`round`, [`::negative-integer`, `::positive-integer`], [`::negative-integer`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`floor`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(floor)`)).toThrow()
      expect(() => lits.run(`(floor 3 4)`)).toThrow()
      expect(lits.run(`(floor 0)`)).toBe(0)
      expect(lits.run(`(floor 1)`)).toBe(1)
      expect(lits.run(`(floor 0.4)`)).toBe(0)
      expect(lits.run(`(floor 0.5)`)).toBe(0)
      expect(lits.run(`(floor 0.6)`)).toBe(0)
      expect(lits.run(`(floor -0.4)`)).toBe(-1)
      expect(lits.run(`(floor -0.5)`)).toBe(-1)
      expect(lits.run(`(floor -0.6)`)).toBe(-1)
    })
    describe(`floor dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`floor`, [`::unknown`], `ERROR`],
        [`floor`, [`::positive-infinity`], [`::positive-infinity`]],
        [`floor`, [`::negative-infinity`], [`::negative-infinity`]],
        [`floor`, [`::nan`], [`::nan`]],
        [`floor`, [`::illegal-number`], [`::illegal-number`]],

        [`floor`, [`::float`], [`::integer`]],
        [`floor`, [`::positive-float`], [`::non-negative-integer`]],
        [`floor`, [`::positive-integer`], [`::positive-integer`]],
        [`floor`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`floor`, [`::negative-float`], [`::negative-integer`]],
        [`floor`, [`::non-negative-float`], [`::non-negative-integer`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`ceil`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(ceil)`)).toThrow()
      expect(() => lits.run(`(ceil 3 4)`)).toThrow()
      expect(lits.run(`(ceil 0)`)).toBe(0)
      expect(lits.run(`(ceil 1)`)).toBe(1)
      expect(lits.run(`(ceil 0.4)`)).toBe(1)
      expect(lits.run(`(ceil 0.5)`)).toBe(1)
      expect(lits.run(`(ceil 0.6)`)).toBe(1)
      expect(lits.run(`(ceil -0.4)`)).toBe(-0)
      expect(lits.run(`(ceil -0.5)`)).toBe(-0)
      expect(lits.run(`(ceil -0.6)`)).toBe(-0)
    })
    describe(`ceil dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`ceil`, [`::unknown`], `ERROR`],

        [`ceil`, [`::positive-infinity`], [`::positive-infinity`]],
        [`ceil`, [`::negative-infinity`], [`::negative-infinity`]],
        [`ceil`, [`::nan`], [`::nan`]],
        [`ceil`, [`::illegal-number`], [`::illegal-number`]],

        [`ceil`, [`::float`], [`::integer`]],
        [`ceil`, [`::positive-float`], [`::positive-integer`]],
        [`ceil`, [`::positive-integer`], [`::positive-integer`]],
        [`ceil`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`ceil`, [`::negative-float`], [`::non-positive-integer`]],
        [`ceil`, [`::non-negative-float`], [`::non-negative-integer`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`trunc`, () => {
    test(`samples`, () => {
      expect(lits.run(`(trunc 0)`)).toBe(0)
      expect(lits.run(`(trunc 0.123)`)).toBe(0)
      expect(lits.run(`(trunc 0.999)`)).toBe(0)
      expect(lits.run(`(trunc -0.99)`)).toBe(-0)
      expect(lits.run(`(trunc -0.1)`)).toBe(-0)
      expect(() => lits.run(`(trunc)`)).toThrow()
      expect(() => lits.run(`(trunc 100 200)`)).toThrow()
    })
    describe(`trunc dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`trunc`, [`::unknown`], `ERROR`],

        [`trunc`, [`::positive-infinity`], [`::positive-infinity`]],
        [`trunc`, [`::negative-infinity`], [`::negative-infinity`]],
        [`trunc`, [`::nan`], [`::nan`]],
        [`trunc`, [`::illegal-number`], [`::illegal-number`]],

        [`trunc`, [`::float`], [`::integer`]],
        [`trunc`, [`::positive-float`], [`::non-negative-integer`]],
        [`trunc`, [`::positive-integer`], [`::positive-integer`]],
        [`trunc`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`trunc`, [`::negative-float`], [`::non-positive-integer`]],
        [`trunc`, [`::non-negative-float`], [`::non-negative-integer`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`rand!`, () => {
    test(`samples`, () => {
      expect(lits.run(`(rand!)`)).toBeLessThan(1)
      expect(() => lits.run(`(rand! 0.1)`)).toThrow()
      expect(() => lits.run(`(rand! :x)`)).toThrow()
      expect(() => lits.run(`(rand! 1 2)`)).toThrow()
    })
  })

  describe(`rand-int!`, () => {
    test(`samples`, () => {
      expect(lits.run(`(rand-int! 1)`)).toBe(0)
      expect(lits.run(`(rand-int! 2)`)).toBeLessThan(2)
      expect(lits.run(`(rand-int! 20)`)).toBeLessThan(20)
      expect(lits.run(`(rand-int! 10.1)`)).toBeLessThan(10.1)
      expect(() => lits.run(`(rand-int! :x)`)).toThrow()
      expect(() => lits.run(`(rand-int! 1 2)`)).toThrow()
    })
    describe(`rand-int! dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`rand-int!`, [`::unknown`], `ERROR`],

        [`rand-int!`, [`::positive-infinity`], [`::positive-infinity`]],
        [`rand-int!`, [`::negative-infinity`], [`::negative-infinity`]],
        [`rand-int!`, [`::nan`], [`::nan`]],
        [`rand-int!`, [`::illegal-number`], [`::illegal-number`]],

        [`rand-int!`, [`::float`], [`::integer`]],
        [`rand-int!`, [`::positive-float`], [`::non-negative-integer`]],
        [`rand-int!`, [`::positive-integer`], [`::non-negative-integer`]],
        [`rand-int!`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`rand-int!`, [`::negative-float`], [`::non-positive-integer`]],
        [`rand-int!`, [`::non-negative-float`], [`::non-negative-integer`]],
        [`rand-int!`, [`::zero`], [`::zero`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`min`, () => {
    test(`samples`, () => {
      expect(lits.run(`(min 1)`)).toBe(1)
      expect(lits.run(`(min 1 -2)`)).toBe(-2)
      expect(lits.run(`(min 3 1 2 )`)).toBe(1)
      expect(() => lits.run(`(min)`)).toThrow()
      expect(() => lits.run(`(min :1)`)).toThrow()
      expect(() => lits.run(`(min :1 :3)`)).toThrow()
    })
  })

  describe(`max`, () => {
    test(`samples`, () => {
      expect(lits.run(`(max 1)`)).toBe(1)
      expect(lits.run(`(max 1 -2)`)).toBe(1)
      expect(lits.run(`(max 3 1 2 )`)).toBe(3)
      expect(() => lits.run(`(max)`)).toThrow()
      expect(() => lits.run(`(max :1)`)).toThrow()
      expect(() => lits.run(`(max :1 :3)`)).toThrow()
    })
  })

  describe(`e`, () => {
    test(`samples`, () => {
      expect(lits.run(`(e)`)).toBe(Math.E)
      expect(() => lits.run(`(e :1)`)).toThrow()
    })
  })

  describe(`max-value`, () => {
    test(`samples`, () => {
      expect(lits.run(`(max-value)`)).toBe(MAX_NUMBER)
      expect(() => lits.run(`(max-value :1)`)).toThrow()
    })
  })

  describe(`min-value`, () => {
    test(`samples`, () => {
      expect(lits.run(`(min-value)`)).toBe(MIN_NUMBER)
      expect(() => lits.run(`(min-value :1)`)).toThrow()
    })
  })

  describe(`nan`, () => {
    test(`samples`, () => {
      expect(lits.run(`(nan)`)).toBeNaN()
      expect(() => lits.run(`(nan :1)`)).toThrow()
    })
  })

  describe(`positive-infinity`, () => {
    test(`samples`, () => {
      expect(lits.run(`(positive-infinity)`)).toBe(Number.POSITIVE_INFINITY)
      expect(() => lits.run(`(positive-infinity :1)`)).toThrow()
    })
  })

  describe(`negative-infinity`, () => {
    test(`samples`, () => {
      expect(lits.run(`(negative-infinity)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(() => lits.run(`(negative-infinity :1)`)).toThrow()
    })
  })

  describe(`pi`, () => {
    test(`samples`, () => {
      expect(lits.run(`(pi)`)).toBe(Math.PI)
      expect(() => lits.run(`(pi 1)`)).toThrow()
    })
  })

  describe(`abs`, () => {
    test(`samples`, () => {
      expect(lits.run(`(abs 2)`)).toBe(2)
      expect(lits.run(`(abs -2)`)).toBe(2)
      expect(lits.run(`(abs -0)`)).toBe(0)
      expect(() => lits.run(`(abs)`)).toThrow()
      expect(() => lits.run(`(abs 1 2)`)).toThrow()
    })
  })

  describe(`sign`, () => {
    test(`samples`, () => {
      expect(lits.run(`(sign 2)`)).toBe(1)
      expect(lits.run(`(sign -2)`)).toBe(-1)
      expect(lits.run(`(sign -0)`)).toBe(-0)
      expect(lits.run(`(sign 0)`)).toBe(0)
      expect(() => lits.run(`(sign)`)).toThrow()
      expect(() => lits.run(`(sign 1 2)`)).toThrow()
    })
  })

  describe(`exp`, () => {
    test(`samples`, () => {
      expect(lits.run(`(exp 1)`)).toBe(Math.exp(1))
      expect(lits.run(`(exp -2)`)).toBe(Math.exp(-2))
      expect(lits.run(`(exp -0)`)).toBe(Math.exp(-0))
      expect(lits.run(`(exp 0)`)).toBe(Math.exp(0))
      expect(() => lits.run(`(exp)`)).toThrow()
      expect(() => lits.run(`(exp 1 2)`)).toThrow()
    })
  })

  describe(`log`, () => {
    test(`samples`, () => {
      expect(lits.run(`(log 0.1)`)).toBe(Math.log(0.1))
      expect(lits.run(`(log 1)`)).toBe(Math.log(1))
      expect(lits.run(`(log 100)`)).toBe(Math.log(100))
      expect(lits.run(`(log -2)`)).toBeNaN()
      expect(lits.run(`(log 0)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(lits.run(`(log -0)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(() => lits.run(`(log)`)).toThrow()
      expect(() => lits.run(`(log 1 2)`)).toThrow()
    })
  })

  describe(`log2`, () => {
    test(`samples`, () => {
      expect(lits.run(`(log2 0.1)`)).toBe(Math.log2(0.1))
      expect(lits.run(`(log2 1)`)).toBe(Math.log2(1))
      expect(lits.run(`(log2 100)`)).toBe(Math.log2(100))
      expect(lits.run(`(log2 -2)`)).toBeNaN()
      expect(lits.run(`(log2 0)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(lits.run(`(log2 -0)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(() => lits.run(`(log2)`)).toThrow()
      expect(() => lits.run(`(log2 1 2)`)).toThrow()
    })
  })

  describe(`log10`, () => {
    test(`samples`, () => {
      expect(lits.run(`(log10 0.1)`)).toBe(Math.log10(0.1))
      expect(lits.run(`(log10 1)`)).toBe(Math.log10(1))
      expect(lits.run(`(log10 100)`)).toBe(Math.log10(100))
      expect(lits.run(`(log10 -2)`)).toBeNaN()
      expect(lits.run(`(log10 0)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(lits.run(`(log10 -0)`)).toBe(Number.NEGATIVE_INFINITY)
      expect(() => lits.run(`(log10)`)).toThrow()
      expect(() => lits.run(`(log10 1 2)`)).toThrow()
    })
  })

  describe(`sin`, () => {
    test(`samples`, () => {
      expect(lits.run(`(sin 0)`)).toBe(Math.sin(0))
      expect(lits.run(`(sin 0.1)`)).toBe(Math.sin(0.1))
      expect(lits.run(`(sin -0.1)`)).toBe(Math.sin(-0.1))
      expect(lits.run(`(sin 1)`)).toBe(Math.sin(1))
      expect(lits.run(`(sin 100)`)).toBe(Math.sin(100))
      expect(() => lits.run(`(sin)`)).toThrow()
      expect(() => lits.run(`(sin 1 2)`)).toThrow()
    })
  })
  describe(`cos`, () => {
    test(`samples`, () => {
      expect(lits.run(`(cos 0)`)).toBe(Math.cos(0))
      expect(lits.run(`(cos 0.1)`)).toBe(Math.cos(0.1))
      expect(lits.run(`(cos -0.1)`)).toBe(Math.cos(-0.1))
      expect(lits.run(`(cos 1)`)).toBe(Math.cos(1))
      expect(lits.run(`(cos 100)`)).toBe(Math.cos(100))
      expect(() => lits.run(`(cos)`)).toThrow()
      expect(() => lits.run(`(cos 1 2)`)).toThrow()
    })
  })
  describe(`tan`, () => {
    test(`samples`, () => {
      expect(lits.run(`(tan 0)`)).toBe(Math.tan(0))
      expect(lits.run(`(tan 0.1)`)).toBe(Math.tan(0.1))
      expect(lits.run(`(tan -0.1)`)).toBe(Math.tan(-0.1))
      expect(lits.run(`(tan 1)`)).toBe(Math.tan(1))
      expect(lits.run(`(tan 100)`)).toBe(Math.tan(100))
      expect(() => lits.run(`(tan)`)).toThrow()
      expect(() => lits.run(`(tan 1 2)`)).toThrow()
    })
  })

  describe(`sinh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(sinh 0)`)).toBe(Math.sinh(0))
      expect(lits.run(`(sinh 0.1)`)).toBe(Math.sinh(0.1))
      expect(lits.run(`(sinh -0.1)`)).toBe(Math.sinh(-0.1))
      expect(lits.run(`(sinh 1)`)).toBe(Math.sinh(1))
      expect(lits.run(`(sinh 100)`)).toBe(Number.POSITIVE_INFINITY)
      expect(() => lits.run(`(sinh)`)).toThrow()
      expect(() => lits.run(`(sinh 1 2)`)).toThrow()
    })
  })
  describe(`cosh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(cosh 0)`)).toBe(Math.cosh(0))
      expect(lits.run(`(cosh 0.1)`)).toBe(Math.cosh(0.1))
      expect(lits.run(`(cosh -0.1)`)).toBe(Math.cosh(-0.1))
      expect(lits.run(`(cosh 1)`)).toBe(Math.cosh(1))
      expect(lits.run(`(cosh 100)`)).toBe(Number.POSITIVE_INFINITY)
      expect(() => lits.run(`(cosh)`)).toThrow()
      expect(() => lits.run(`(cosh 1 2)`)).toThrow()
    })
  })
  describe(`tanh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(tanh 0)`)).toBe(Math.tanh(0))
      expect(lits.run(`(tanh 0.1)`)).toBe(Math.tanh(0.1))
      expect(lits.run(`(tanh -0.1)`)).toBe(Math.tanh(-0.1))
      expect(lits.run(`(tanh 1)`)).toBe(Math.tanh(1))
      expect(lits.run(`(tanh 100)`)).toBe(Math.tanh(100))
      expect(() => lits.run(`(tanh)`)).toThrow()
      expect(() => lits.run(`(tanh 1 2)`)).toThrow()
    })
  })

  describe(`asin`, () => {
    test(`samples`, () => {
      expect(lits.run(`(asin 0)`)).toBe(Math.asin(0))
      expect(lits.run(`(asin 0.1)`)).toBe(Math.asin(0.1))
      expect(lits.run(`(asin -0.1)`)).toBe(Math.asin(-0.1))
      expect(lits.run(`(asin 1)`)).toBe(Math.asin(1))
      expect(lits.run(`(asin 100)`)).toBeNaN()
      expect(() => lits.run(`(asin)`)).toThrow()
      expect(() => lits.run(`(asin 1 2)`)).toThrow()
    })
  })
  describe(`acos`, () => {
    test(`samples`, () => {
      expect(lits.run(`(acos 0)`)).toBe(Math.acos(0))
      expect(lits.run(`(acos 0.1)`)).toBe(Math.acos(0.1))
      expect(lits.run(`(acos -0.1)`)).toBe(Math.acos(-0.1))
      expect(lits.run(`(acos 1)`)).toBe(Math.acos(1))
      expect(lits.run(`(acos 100)`)).toBeNaN()
      expect(() => lits.run(`(acos)`)).toThrow()
      expect(() => lits.run(`(acos 1 2)`)).toThrow()
    })
  })
  describe(`atan`, () => {
    test(`samples`, () => {
      expect(lits.run(`(atan 0)`)).toBe(Math.atan(0))
      expect(lits.run(`(atan 0.1)`)).toBe(Math.atan(0.1))
      expect(lits.run(`(atan -0.1)`)).toBe(Math.atan(-0.1))
      expect(lits.run(`(atan 1)`)).toBe(Math.atan(1))
      expect(lits.run(`(atan 100)`)).toBe(Math.atan(100))
      expect(() => lits.run(`(atan)`)).toThrow()
      expect(() => lits.run(`(atan 1 2)`)).toThrow()
    })
  })

  describe(`asinh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(asinh 0)`)).toBe(Math.asinh(0))
      expect(lits.run(`(asinh 0.1)`)).toBe(Math.asinh(0.1))
      expect(lits.run(`(asinh -0.1)`)).toBe(Math.asinh(-0.1))
      expect(lits.run(`(asinh 1)`)).toBe(Math.asinh(1))
      expect(lits.run(`(asinh 100)`)).toBe(Math.asinh(100))
      expect(() => lits.run(`(asinh)`)).toThrow()
      expect(() => lits.run(`(asinh 1 2)`)).toThrow()
    })
  })
  describe(`acosh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(acosh 1)`)).toBe(Math.acosh(1))
      expect(lits.run(`(acosh 100)`)).toBe(Math.acosh(100))
      expect(lits.run(`(acosh 0.1)`)).toBeNaN()
      expect(lits.run(`(acosh -0.1)`)).toBeNaN()
      expect(lits.run(`(acosh 0)`)).toBeNaN()
      expect(() => lits.run(`(acosh)`)).toThrow()
      expect(() => lits.run(`(acosh 1 2)`)).toThrow()
    })
  })
  describe(`atanh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(atanh 0)`)).toBe(Math.atanh(0))
      expect(lits.run(`(atanh 0.1)`)).toBe(Math.atanh(0.1))
      expect(lits.run(`(atanh -0.1)`)).toBe(Math.atanh(-0.1))
      expect(lits.run(`(atanh 1)`)).toBe(Number.POSITIVE_INFINITY)
      expect(lits.run(`(atanh 100)`)).toBeNaN()
      expect(() => lits.run(`(atanh)`)).toThrow()
      expect(() => lits.run(`(atanh 1 2)`)).toThrow()
    })
  })

  describe(`quot`, () => {
    test(`samples`, () => {
      expect(lits.run(`(quot 13.75 3.25)`)).toBe(4)
      expect(lits.run(`(quot -13.75 3.25)`)).toBe(-4)
      expect(lits.run(`(quot 13.75 -3.25)`)).toBe(-4)
      expect(lits.run(`(quot -13.75 -3.25)`)).toBe(4)
      expect(() => lits.run(`(quot)`)).toThrow()
      expect(() => lits.run(`(quot 1)`)).toThrow()
      expect(() => lits.run(`(quot 1 2 3)`)).toThrow()
    })
    describe(`quot dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [
          `quot`,
          [
            [`::float`, `::illegal-number`],
            [`::float`, `::illegal-number`],
          ],
          [`::integer`, `::illegal-number`],
        ],
        [`quot`, [`::float`, `::float`], [`::integer`, `::illegal-number`]],
        [`quot`, [`::float`, `::positive-float`], [`::integer`, `::infinity`]],
        [`quot`, [`::float`, `::negative-float`], [`::integer`, `::infinity`]],
        [`quot`, [`::float`, `::zero`], [`::illegal-number`]],
        [`quot`, [`::positive-float`, `::zero`], [`::positive-infinity`]],
        [`quot`, [`::negative-float`, `::zero`], [`::negative-infinity`]],
        [`quot`, [`::zero`, `::zero`], [`::nan`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`mod.`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(mod)`)).toThrow()
      expect(() => lits.run(`(mod 3)`)).toThrow()
      expect(() => lits.run(`(mod 3 4 5)`)).toThrow()
      expect(lits.run(`(mod 13.75 3.25)`)).toBe(0.75)
      expect(lits.run(`(mod -13.75 3.25)`)).toBe(2.5)
      expect(lits.run(`(mod 13.75 -3.25)`)).toBe(-2.5)
      expect(lits.run(`(mod -13.75 -3.25)`)).toBe(-0.75)
      expect(lits.run(`(mod 2 1)`)).toBe(0)
      expect(lits.run(`(mod 2 2)`)).toBe(0)
      expect(lits.run(`(mod 3 2)`)).toBe(1)
      expect(lits.run(`(mod 3 -2)`)).toBe(-1)
      expect(lits.run(`(mod -3 -2)`)).toBe(-1)
      expect(lits.run(`(mod -3 2)`)).toBe(1)
      expect(lits.run(`(mod 4 0)`)).toBeNaN()
      expect(() => lits.run(`(mod 4 0 3)`)).toThrow()
    })
    describe(`mod dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [
          `mod`,
          [
            [`::float`, `::illegal-number`],
            [`::float`, `::illegal-number`],
          ],
          [`::float`, `::nan`],
        ],
        [`mod`, [`::float`, `::float`], [`::float`, `::nan`]],
        [`mod`, [`::float`, `::positive-float`], [`::non-negative-float`]],
        [`mod`, [`::float`, `::negative-float`], [`::non-positive-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`rem`, () => {
    test(`samples`, () => {
      expect(lits.run(`(rem 13.75 3.25)`)).toBe(0.75)
      expect(lits.run(`(rem -13.75 3.25)`)).toBe(-0.75)
      expect(lits.run(`(rem 13.75 -3.25)`)).toBe(0.75)
      expect(lits.run(`(rem -13.75 -3.25)`)).toBe(-0.75)
      expect(() => lits.run(`(rem)`)).toThrow()
      expect(() => lits.run(`(rem 1)`)).toThrow()
      expect(() => lits.run(`(rem 1 2 3)`)).toThrow()
    })
    describe(`rem dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [
          `rem`,
          [
            [`::float`, `::illegal-number`],
            [`::float`, `::illegal-number`],
          ],
          [`::float`, `::nan`],
        ],
        [`rem`, [`::float`, `::float`], [`::float`, `::nan`]],
        [`rem`, [`::positive-float`, `::float`], [`::non-negative-float`, `::nan`]],
        [`rem`, [`::negative-float`, `::float`], [`::non-positive-float`, `::nan`]],
        [`rem`, [`::positive-float`, `::non-zero-float`], [`::non-negative-float`]],
        [`rem`, [`::negative-float`, `::non-zero-float`], [`::non-positive-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })
  // }
})
