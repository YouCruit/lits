import { Lits } from '../../../src'
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
        [`inc`, [`::nan`], `::nan`],
        [`inc`, [`::positive-infinity`], `::positive-infinity`],
        [`inc`, [`::negative-infinity`], `::negative-infinity`],

        [`inc`, [`::zero`], `::positive-integer`],
        [`inc`, [`::number`], `::number`],
        [`inc`, [`::integer`], `::integer`],
        [`inc`, [`::non-zero-number`], `::number`],
        [`inc`, [`::non-zero-integer`], `::integer`],
        [`inc`, [`::non-integer`], `::non-integer`],
        [`inc`, [`::positive-number`], `::positive-number`],
        [`inc`, [`::non-positive-number`], `::number`],
        [`inc`, [`::positive-integer`], `::positive-integer`],
        [`inc`, [`::positive-non-integer`], `::positive-non-integer`],
        [`inc`, [`::non-positive-integer`], `::integer`],
        [`inc`, [`::negative-number`], [`::non-positive-number`, `::positive-non-integer`]],
        [`inc`, [`::non-negative-number`], `::positive-number`],
        [`inc`, [`::negative-integer`], `::non-positive-integer`],
        [`inc`, [`::negative-non-integer`], `::non-integer`],
        [`inc`, [`::non-negative-integer`], `::positive-integer`],
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
        [`dec`, [`::nan`], `::nan`],
        [`dec`, [`::positive-infinity`], `::positive-infinity`],
        [`dec`, [`::negative-infinity`], `::negative-infinity`],

        [`dec`, [`::zero`], `::negative-integer`],
        [`dec`, [`::number`], `::number`],
        [`dec`, [`::integer`], `::integer`],
        [`dec`, [`::non-zero-number`], `::number`],
        [`dec`, [`::non-zero-integer`], `::integer`],
        [`dec`, [`::non-integer`], `::non-integer`],
        [`dec`, [`::positive-number`], [`::non-negative-number`, `::negative-non-integer`]],
        [`dec`, [`::non-positive-number`], `::negative-number`],
        [`dec`, [`::positive-integer`], `::non-negative-integer`],
        [`dec`, [`::positive-non-integer`], `::non-integer`],
        [`dec`, [`::non-positive-integer`], `::negative-integer`],
        [`dec`, [`::negative-number`], `::negative-number`],
        [`dec`, [`::non-negative-number`], `::number`],
        [`dec`, [`::negative-integer`], `::negative-integer`],
        [`dec`, [`::negative-non-integer`], `::negative-non-integer`],
        [`dec`, [`::non-negative-integer`], `::integer`],
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
        [`+`, [`::illegal-number`], `::illegal-number`],
        [`+`, [`::nan`], `::nan`],
        [`+`, [`::positive-infinity`], `::positive-infinity`],
        [`+`, [`::negative-infinity`], `::negative-infinity`],
        [`+`, [`::zero`], `::zero`],
        [`+`, [`::number`], `::number`],
        [`+`, [`::integer`], `::integer`],
        [`+`, [`::non-zero-number`], `::non-zero-number`],
        [`+`, [`::non-zero-integer`], `::non-zero-integer`],
        [`+`, [`::non-integer`], `::non-integer`],
        [`+`, [`::positive-number`], `::positive-number`],
        [`+`, [`::non-positive-number`], `::non-positive-number`],
        [`+`, [`::positive-integer`], `::positive-integer`],
        [`+`, [`::positive-non-integer`], `::positive-non-integer`],
        [`+`, [`::non-positive-integer`], `::non-positive-integer`],
        [`+`, [`::negative-number`], `::negative-number`],
        [`+`, [`::non-negative-number`], `::non-negative-number`],
        [`+`, [`::negative-integer`], `::negative-integer`],
        [`+`, [`::negative-non-integer`], `::negative-non-integer`],
        [`+`, [`::non-negative-integer`], `::non-negative-integer`],

        [`+`, [`::illegal-number`, `::illegal-number`], `::illegal-number`],
        [`+`, [`::illegal-number`, `::nan`], `::nan`],
        [`+`, [`::illegal-number`, `::positive-infinity`], [`::positive-infinity`, `::nan`]],
        [`+`, [`::illegal-number`, `::negative-infinity`], [`::negative-infinity`, `::nan`]],
        [`+`, [`::illegal-number`, `::number`], `::illegal-number`],

        [`+`, [`::nan`, `::illegal-number`], `::nan`],
        [`+`, [`::nan`, `::nan`], `::nan`],
        [`+`, [`::nan`, `::positive-infinity`], `::nan`],
        [`+`, [`::nan`, `::negative-infinity`], `::nan`],
        [`+`, [`::nan`, `::number`], `::nan`],

        [`+`, [`::positive-infinity`, `::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`+`, [`::positive-infinity`, `::nan`], `::nan`],
        [`+`, [`::positive-infinity`, `::positive-infinity`], `::positive-infinity`],
        [`+`, [`::positive-infinity`, `::negative-infinity`], `::nan`],
        [`+`, [`::positive-infinity`, `::number`], `::positive-infinity`],

        [`+`, [`::negative-infinity`, `::illegal-number`], [`::negative-infinity`, `::nan`]],
        [`+`, [`::negative-infinity`, `::nan`], `::nan`],
        [`+`, [`::negative-infinity`, `::positive-infinity`], `::nan`],
        [`+`, [`::negative-infinity`, `::negative-infinity`], `::negative-infinity`],
        [`+`, [`::negative-infinity`, `::number`], `::negative-infinity`],

        [`+`, [`::zero`, `::zero`], `::zero`],
        [`+`, [`::zero`, `::integer`], `::integer`],
        [`+`, [`::zero`, `::positive-integer`], `::positive-integer`],
        [`+`, [`::zero`, `::positive-non-integer`], `::positive-non-integer`],
        [`+`, [`::zero`, `::positive-number`], `::positive-number`],
        [`+`, [`::zero`, `::positive-infinity`], `::positive-infinity`],

        [`+`, [`::positive-number`, `::zero`], `::positive-number`],
        [`+`, [`::positive-number`, `::positive-integer`], `::positive-number`],
        [`+`, [`::positive-number`, `::positive-non-integer`], `::positive-number`],
        [`+`, [`::positive-number`, `::non-positive-integer`], `::number`],
        [`+`, [`::positive-number`, `::negative-number`], `::number`],
        [`+`, [`::positive-number`, `::positive-infinity`], `::positive-infinity`],

        [`+`, [`::positive-integer`, `::zero`], `::positive-integer`],
        [`+`, [`::positive-integer`, `::positive-integer`], `::positive-integer`],
        [`+`, [`::positive-integer`, `::positive-non-integer`], `::positive-non-integer`],
        [`+`, [`::positive-integer`, `::non-negative-integer`], `::positive-integer`],
        [`+`, [`::positive-integer`, `::negative-number`], `::number`],
        [`+`, [`::positive-integer`, `::negative-integer`], `::integer`],
        [`+`, [`::positive-integer`, `::negative-infinity`], `::negative-infinity`],

        [`+`, [`::positive-non-integer`, `::zero`], `::positive-non-integer`],
        [`+`, [`::positive-non-integer`, `::positive-integer`], `::positive-non-integer`],
        [`+`, [`::positive-non-integer`, `::positive-non-integer`], `::positive-number`],
        [`+`, [`::positive-non-integer`, `::non-negative-integer`], `::positive-non-integer`],
        [`+`, [`::positive-non-integer`, `::negative-number`], `::number`],
        [`+`, [`::positive-non-integer`, `::negative-integer`], `::non-integer`],
        [`+`, [`::positive-non-integer`, `::nan`], `::nan`],

        [`+`, [`::negative-integer`, `::zero`], `::negative-integer`],
        [`+`, [`::negative-integer`, `::positive-integer`], `::integer`],
        [`+`, [`::negative-integer`, `::positive-non-integer`], `::non-integer`],
        [`+`, [`::negative-integer`, `::non-negative-integer`], `::integer`],
        [`+`, [`::negative-integer`, `::negative-number`], `::negative-number`],
        [`+`, [`::negative-integer`, `::negative-integer`], `::negative-integer`],
        [`+`, [`::negative-integer`, `::illegal-number`], `::illegal-number`],

        [`+`, [`::negative-non-integer`, `::zero`], `::negative-non-integer`],
        [`+`, [`::negative-non-integer`, `::positive-integer`], `::non-integer`],
        [`+`, [`::negative-non-integer`, `::positive-non-integer`], `::number`],
        [`+`, [`::negative-non-integer`, `::non-negative-integer`], `::non-integer`],
        [`+`, [`::negative-non-integer`, `::negative-number`], `::negative-number`],
        [`+`, [`::negative-non-integer`, `::negative-integer`], `::negative-non-integer`],
        [`+`, [`::negative-non-integer`, `::positive-infinity`], `::positive-infinity`],

        [`+`, [`::negative-number`, `::zero`], `::negative-number`],
        [`+`, [`::negative-number`, `::positive-integer`], `::number`],
        [`+`, [`::negative-number`, `::positive-non-integer`], `::number`],
        [`+`, [`::negative-number`, `::non-positive-integer`], `::negative-number`],
        [`+`, [`::negative-number`, `::negative-number`], `::negative-number`],
        [`+`, [`::negative-number`, `::negative-infinity`], `::negative-infinity`],

        [`+`, [`::non-negative-integer`, `::zero`], `::non-negative-integer`],
        [`+`, [`::non-negative-integer`, `::positive-integer`], `::positive-integer`],
        [`+`, [`::non-negative-integer`, `::positive-non-integer`], `::positive-non-integer`],
        [`+`, [`::non-negative-integer`, `::non-negative-integer`], `::non-negative-integer`],
        [`+`, [`::non-negative-integer`, `::negative-number`], `::number`],
        [`+`, [`::non-negative-integer`, `::negative-integer`], `::integer`],
        [`+`, [`::non-negative-integer`, `::nan`], `::nan`],

        [`+`, [`::non-positive-number`, `::zero`], `::non-positive-number`],
        [`+`, [`::non-positive-number`, `::positive-integer`], `::number`],
        [`+`, [`::non-positive-number`, `::positive-non-integer`], `::number`],
        [`+`, [`::non-positive-number`, `::non-positive-integer`], `::non-positive-number`],
        [`+`, [`::non-positive-number`, `::negative-number`], `::negative-number`],
        [`+`, [`::non-positive-number`, `::illegal-number`], `::illegal-number`],

        [`+`, [`::non-positive-integer`, `::zero`], `::non-positive-integer`],
        [`+`, [`::non-positive-integer`, `::positive-integer`], `::integer`],
        [`+`, [`::non-positive-integer`, `::positive-non-integer`], `::non-integer`],
        [`+`, [`::non-positive-integer`, `::non-negative-integer`], `::integer`],
        [`+`, [`::non-positive-integer`, `::negative-number`], `::negative-number`],
        [`+`, [`::non-positive-integer`, `::negative-integer`], `::negative-integer`],
        [`+`, [`::non-positive-integer`, `::positive-infinity`], `::positive-infinity`],

        [`+`, [`::non-negative-number`, `::zero`], `::non-negative-number`],
        [`+`, [`::non-negative-number`, `::positive-integer`], `::positive-number`],
        [`+`, [`::non-negative-number`, `::positive-non-integer`], `::positive-number`],
        [`+`, [`::non-negative-number`, `::non-positive-integer`], `::number`],
        [`+`, [`::non-negative-number`, `::negative-number`], `::number`],
        [`+`, [`::non-negative-number`, `::negative-infinity`], `::negative-infinity`],

        [`+`, [`::integer`, `::zero`], `::integer`],
        [`+`, [`::integer`, `::positive-integer`], `::integer`],
        [`+`, [`::integer`, `::positive-non-integer`], `::non-integer`],
        [`+`, [`::integer`, `::non-negative-integer`], `::integer`],
        [`+`, [`::integer`, `::negative-number`], `::number`],
        [`+`, [`::integer`, `::negative-integer`], `::integer`],
        [`+`, [`::integer`, `::nan`], `::nan`],

        [`+`, [`::non-integer`, `::zero`], `::non-integer`],
        [`+`, [`::non-integer`, `::positive-integer`], `::non-integer`],
        [`+`, [`::non-integer`, `::positive-non-integer`], `::number`],
        [`+`, [`::non-integer`, `::non-negative-integer`], `::non-integer`],
        [`+`, [`::non-integer`, `::negative-number`], `::number`],
        [`+`, [`::non-integer`, `::negative-integer`], `::non-integer`],
        [`+`, [`::non-integer`, `::illegal-number`], `::illegal-number`],

        [`+`, [`::number`, `::zero`], `::number`],
        [`+`, [`::number`, `::positive-integer`], `::number`],
        [`+`, [`::number`, `::positive-non-integer`], `::number`],
        [`+`, [`::number`, `::non-negative-integer`], `::number`],
        [`+`, [`::number`, `::negative-number`], `::number`],
        [`+`, [`::number`, `::negative-integer`], `::number`],
        [`+`, [`::number`, `::positive-number`], `::number`],
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
        [`-`, [], { expression: `0` }],

        [`-`, [`::illegal-number`], `::illegal-number`],
        [`-`, [`::nan`], `::nan`],
        [`-`, [`::positive-infinity`], `::negative-infinity`],
        [`-`, [`::negative-infinity`], `::positive-infinity`],

        [`-`, [`::zero`], `::zero`],
        [`-`, [`::number`], `::number`],
        [`-`, [`::integer`], `::integer`],
        [`-`, [`::non-zero-number`], `::non-zero-number`],
        [`-`, [`::non-zero-integer`], `::non-zero-integer`],
        [`-`, [`::non-integer`], `::non-integer`],
        [`-`, [`::positive-number`], `::negative-number`],
        [`-`, [`::non-positive-number`], `::non-negative-number`],
        [`-`, [`::positive-integer`], `::negative-integer`],
        [`-`, [`::positive-non-integer`], `::negative-non-integer`],
        [`-`, [`::non-positive-integer`], `::non-negative-integer`],
        [`-`, [`::negative-number`], `::positive-number`],
        [`-`, [`::non-negative-number`], `::non-positive-number`],
        [`-`, [`::negative-integer`], `::positive-integer`],
        [`-`, [`::negative-non-integer`], `::positive-non-integer`],
        [`-`, [`::non-negative-integer`], `::non-positive-integer`],

        [`-`, [`::illegal-number`, `::illegal-number`], `::illegal-number`],
        [`-`, [`::illegal-number`, `::nan`], `::nan`],
        [`-`, [`::illegal-number`, `::positive-infinity`], [`::negative-infinity`, `::nan`]],
        [`-`, [`::illegal-number`, `::negative-infinity`], [`::positive-infinity`, `::nan`]],
        [`-`, [`::illegal-number`, `::number`], `::illegal-number`],

        [`-`, [`::nan`, `::illegal-number`], `::nan`],
        [`-`, [`::nan`, `::nan`], `::nan`],
        [`-`, [`::nan`, `::positive-infinity`], `::nan`],
        [`-`, [`::nan`, `::negative-infinity`], `::nan`],
        [`-`, [`::nan`, `::number`], `::nan`],

        [`-`, [`::positive-infinity`, `::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`-`, [`::positive-infinity`, `::nan`], `::nan`],
        [`-`, [`::positive-infinity`, `::positive-infinity`], `::nan`],
        [`-`, [`::positive-infinity`, `::negative-infinity`], `::positive-infinity`],
        [`-`, [`::positive-infinity`, `::number`], `::positive-infinity`],

        [`-`, [`::negative-infinity`, `::illegal-number`], [`::negative-infinity`, `::nan`]],
        [`-`, [`::negative-infinity`, `::nan`], `::nan`],
        [`-`, [`::negative-infinity`, `::positive-infinity`], `::negative-infinity`],
        [`-`, [`::negative-infinity`, `::negative-infinity`], `::nan`],
        [`-`, [`::negative-infinity`, `::number`], `::negative-infinity`],

        [`-`, [`::zero`, `::zero`], `::zero`],
        [`-`, [`::zero`, `::integer`], `::integer`],
        [`-`, [`::zero`, `::positive-integer`], `::negative-integer`],
        [`-`, [`::zero`, `::positive-non-integer`], `::negative-non-integer`],
        [`-`, [`::zero`, `::positive-number`], `::negative-number`],

        [`-`, [`::positive-number`, `::zero`], `::positive-number`],
        [`-`, [`::positive-number`, `::positive-integer`], `::number`],
        [`-`, [`::positive-number`, `::positive-non-integer`], `::number`],
        [`-`, [`::positive-number`, `::non-positive-integer`], `::positive-number`],
        [`-`, [`::positive-number`, `::negative-number`], `::positive-number`],

        [`-`, [`::positive-integer`, `::zero`], `::positive-integer`],
        [`-`, [`::positive-integer`, `::positive-integer`], `::integer`],
        [`-`, [`::positive-integer`, `::positive-non-integer`], `::non-integer`],
        [`-`, [`::positive-integer`, `::non-negative-integer`], `::integer`],
        [`-`, [`::positive-integer`, `::negative-number`], `::positive-number`],
        [`-`, [`::positive-integer`, `::negative-integer`], `::positive-integer`],

        [`-`, [`::positive-non-integer`, `::zero`], `::positive-non-integer`],
        [`-`, [`::positive-non-integer`, `::positive-integer`], `::non-integer`],
        [`-`, [`::positive-non-integer`, `::positive-non-integer`], `::number`],
        [`-`, [`::positive-non-integer`, `::non-negative-integer`], `::non-integer`],
        [`-`, [`::positive-non-integer`, `::negative-number`], `::positive-number`],
        [`-`, [`::positive-non-integer`, `::negative-integer`], `::positive-non-integer`],

        [`-`, [`::negative-integer`, `::zero`], `::negative-integer`],
        [`-`, [`::negative-integer`, `::positive-integer`], `::negative-integer`],
        [`-`, [`::negative-integer`, `::positive-non-integer`], `::negative-non-integer`],
        [`-`, [`::negative-integer`, `::non-negative-integer`], `::negative-integer`],
        [`-`, [`::negative-integer`, `::negative-number`], `::number`],
        [`-`, [`::negative-integer`, `::negative-integer`], `::integer`],

        [`-`, [`::negative-non-integer`, `::zero`], `::negative-non-integer`],
        [`-`, [`::negative-non-integer`, `::positive-integer`], `::negative-non-integer`],
        [`-`, [`::negative-non-integer`, `::positive-non-integer`], `::negative-number`],
        [`-`, [`::negative-non-integer`, `::non-negative-integer`], `::negative-non-integer`],
        [`-`, [`::negative-non-integer`, `::negative-number`], `::number`],
        [`-`, [`::negative-non-integer`, `::negative-integer`], `::non-integer`],

        [`-`, [`::negative-number`, `::zero`], `::negative-number`],
        [`-`, [`::negative-number`, `::positive-integer`], `::negative-number`],
        [`-`, [`::negative-number`, `::positive-non-integer`], `::negative-number`],
        [`-`, [`::negative-number`, `::non-positive-integer`], `::number`],
        [`-`, [`::negative-number`, `::negative-number`], `::number`],

        [`-`, [`::non-negative-integer`, `::zero`], `::non-negative-integer`],
        [`-`, [`::non-negative-integer`, `::positive-integer`], `::integer`],
        [`-`, [`::non-negative-integer`, `::positive-non-integer`], `::non-integer`],
        [`-`, [`::non-negative-integer`, `::non-negative-integer`], `::integer`],
        [`-`, [`::non-negative-integer`, `::negative-number`], `::positive-number`],
        [`-`, [`::non-negative-integer`, `::negative-integer`], `::positive-integer`],

        [`-`, [`::non-positive-number`, `::zero`], `::non-positive-number`],
        [`-`, [`::non-positive-number`, `::positive-integer`], `::negative-number`],
        [`-`, [`::non-positive-number`, `::positive-non-integer`], `::negative-number`],
        [`-`, [`::non-positive-number`, `::non-positive-integer`], `::number`],
        [`-`, [`::non-positive-number`, `::negative-number`], `::number`],

        [`-`, [`::non-positive-integer`, `::zero`], `::non-positive-integer`],
        [`-`, [`::non-positive-integer`, `::positive-integer`], `::negative-integer`],
        [`-`, [`::non-positive-integer`, `::positive-non-integer`], `::negative-non-integer`],
        [`-`, [`::non-positive-integer`, `::non-negative-integer`], `::non-positive-integer`],
        [`-`, [`::non-positive-integer`, `::non-positive-integer`], `::integer`],
        [`-`, [`::non-positive-integer`, `::negative-number`], `::number`],
        [`-`, [`::non-positive-integer`, `::negative-integer`], `::integer`],

        [`-`, [`::non-negative-number`, `::zero`], `::non-negative-number`],
        [`-`, [`::non-negative-number`, `::positive-integer`], `::number`],
        [`-`, [`::non-negative-number`, `::positive-non-integer`], `::number`],
        [`-`, [`::non-negative-number`, `::non-positive-integer`], `::non-negative-number`],
        [`-`, [`::non-negative-number`, `::negative-number`], `::positive-number`],

        [`-`, [`::integer`, `::zero`], `::integer`],
        [`-`, [`::integer`, `::positive-integer`], `::integer`],
        [`-`, [`::integer`, `::positive-non-integer`], `::non-integer`],
        [`-`, [`::integer`, `::non-negative-integer`], `::integer`],
        [`-`, [`::integer`, `::negative-number`], `::number`],
        [`-`, [`::integer`, `::negative-integer`], `::integer`],

        [`-`, [`::non-integer`, `::zero`], `::non-integer`],
        [`-`, [`::non-integer`, `::positive-integer`], `::non-integer`],
        [`-`, [`::non-integer`, `::positive-non-integer`], `::number`],
        [`-`, [`::non-integer`, `::non-negative-integer`], `::non-integer`],
        [`-`, [`::non-integer`, `::negative-number`], `::number`],
        [`-`, [`::non-integer`, `::negative-integer`], `::non-integer`],

        [`-`, [`::number`, `::zero`], `::number`],
        [`-`, [`::number`, `::positive-integer`], `::number`],
        [`-`, [`::number`, `::positive-non-integer`], `::number`],
        [`-`, [`::number`, `::non-negative-integer`], `::number`],
        [`-`, [`::number`, `::negative-number`], `::number`],
        [`-`, [`::number`, `::negative-integer`], `::number`],
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
        [`*`, [`::zero`], `::zero`],
        [`*`, [`::number`], `::number`],
        [`*`, [`::integer`], `::integer`],
        [`*`, [`::non-zero-number`], `::non-zero-number`],
        [`*`, [`::non-zero-integer`], `::non-zero-integer`],
        [`*`, [`::non-integer`], `::non-integer`],
        [`*`, [`::positive-number`], `::positive-number`],
        [`*`, [`::non-positive-number`], `::non-positive-number`],
        [`*`, [`::positive-integer`], `::positive-integer`],
        [`*`, [`::positive-non-integer`], `::positive-non-integer`],
        [`*`, [`::non-positive-integer`], `::non-positive-integer`],
        [`*`, [`::negative-number`], `::negative-number`],
        [`*`, [`::non-negative-number`], `::non-negative-number`],
        [`*`, [`::negative-integer`], `::negative-integer`],
        [`*`, [`::negative-non-integer`], `::negative-non-integer`],
        [`*`, [`::non-negative-integer`], `::non-negative-integer`],

        [`*`, [`::illegal-number`, `::zero`], [`::nan`]],
        [`*`, [`::illegal-number`, `::non-zero-number`], [`::positive-infinity`, `::negative-infinity`, `::nan`]],
        [`*`, [`::illegal-number`, `::illegal-number`], [`::illegal-number`]],

        [`*`, [`::zero`, `::zero`], `::zero`],
        [`*`, [`::zero`, `::integer`], `::zero`],
        [`*`, [`::zero`, `::positive-integer`], `::zero`],
        [`*`, [`::zero`, `::positive-non-integer`], `::zero`],
        [`*`, [`::zero`, `::positive-number`], `::zero`],

        [`*`, [`::positive-number`, `::zero`], `::zero`],
        [`*`, [`::positive-number`, `::positive-integer`], `::positive-number`],
        [`*`, [`::positive-number`, `::positive-non-integer`], `::positive-number`],
        [`*`, [`::positive-number`, `::non-positive-integer`], `::non-positive-number`],
        [`*`, [`::positive-number`, `::negative-number`], `::negative-number`],

        [`*`, [`::positive-integer`, `::zero`], `::zero`],
        [`*`, [`::positive-integer`, `::positive-integer`], `::positive-integer`],
        [`*`, [`::positive-integer`, `::positive-non-integer`], `::positive-number`],
        [`*`, [`::positive-integer`, `::non-negative-integer`], `::non-negative-integer`],
        [`*`, [`::positive-integer`, `::negative-number`], `::negative-number`],
        [`*`, [`::positive-integer`, `::negative-integer`], `::negative-integer`],

        [`*`, [`::positive-non-integer`, `::zero`], `::zero`],
        [`*`, [`::positive-non-integer`, `::positive-integer`], `::positive-number`],
        [`*`, [`::positive-non-integer`, `::positive-non-integer`], `::positive-non-integer`],
        [`*`, [`::positive-non-integer`, `::non-negative-integer`], `::non-negative-number`],
        [`*`, [`::positive-non-integer`, `::negative-number`], `::negative-number`],
        [`*`, [`::positive-non-integer`, `::negative-integer`], `::negative-number`],

        [`*`, [`::negative-integer`, `::zero`], `::zero`],
        [`*`, [`::negative-integer`, `::positive-integer`], `::negative-integer`],
        [`*`, [`::negative-integer`, `::positive-non-integer`], `::negative-number`],
        [`*`, [`::negative-integer`, `::non-negative-integer`], `::non-positive-integer`],
        [`*`, [`::negative-integer`, `::negative-number`], `::positive-number`],
        [`*`, [`::negative-integer`, `::negative-integer`], `::positive-integer`],

        [`*`, [`::negative-non-integer`, `::zero`], `::zero`],
        [`*`, [`::negative-non-integer`, `::positive-integer`], `::negative-number`],
        [`*`, [`::negative-non-integer`, `::positive-non-integer`], `::negative-non-integer`],
        [`*`, [`::negative-non-integer`, `::non-negative-integer`], `::non-positive-number`],
        [`*`, [`::negative-non-integer`, `::negative-number`], `::positive-number`],
        [`*`, [`::negative-non-integer`, `::negative-integer`], `::positive-number`],

        [`*`, [`::negative-number`, `::zero`], `::zero`],
        [`*`, [`::negative-number`, `::positive-integer`], `::negative-number`],
        [`*`, [`::negative-number`, `::positive-non-integer`], `::negative-number`],
        [`*`, [`::negative-number`, `::non-positive-integer`], `::non-negative-number`],
        [`*`, [`::negative-number`, `::negative-number`], `::positive-number`],

        [`*`, [`::non-negative-integer`, `::zero`], `::zero`],
        [`*`, [`::non-negative-integer`, `::positive-integer`], `::non-negative-integer`],
        [`*`, [`::non-negative-integer`, `::positive-non-integer`], `::non-negative-number`],
        [`*`, [`::non-negative-integer`, `::non-negative-integer`], `::non-negative-integer`],
        [`*`, [`::non-negative-integer`, `::negative-number`], `::non-positive-number`],
        [`*`, [`::non-negative-integer`, `::negative-integer`], `::non-positive-integer`],

        [`*`, [`::non-positive-number`, `::zero`], `::zero`],
        [`*`, [`::non-positive-number`, `::positive-integer`], `::non-positive-number`],
        [`*`, [`::non-positive-number`, `::positive-non-integer`], `::non-positive-number`],
        [`*`, [`::non-positive-number`, `::non-positive-integer`], `::non-negative-number`],
        [`*`, [`::non-positive-number`, `::negative-number`], `::non-negative-number`],

        [`*`, [`::non-positive-integer`, `::zero`], `::zero`],
        [`*`, [`::non-positive-integer`, `::positive-integer`], `::non-positive-integer`],
        [`*`, [`::non-positive-integer`, `::positive-non-integer`], `::non-positive-number`],
        [`*`, [`::non-positive-integer`, `::non-negative-integer`], `::non-positive-integer`],
        [`*`, [`::non-positive-integer`, `::negative-number`], `::non-negative-number`],
        [`*`, [`::non-positive-integer`, `::negative-integer`], `::non-negative-integer`],

        [`*`, [`::non-negative-number`, `::zero`], `::zero`],
        [`*`, [`::non-negative-number`, `::positive-integer`], `::non-negative-number`],
        [`*`, [`::non-negative-number`, `::positive-non-integer`], `::non-negative-number`],
        [`*`, [`::non-negative-number`, `::non-positive-integer`], `::non-positive-number`],
        [`*`, [`::non-negative-number`, `::negative-number`], `::non-positive-number`],

        [`*`, [`::integer`, `::zero`], `::zero`],
        [`*`, [`::integer`, `::positive-integer`], `::integer`],
        [`*`, [`::integer`, `::positive-non-integer`], `::number`],
        [`*`, [`::integer`, `::non-negative-integer`], `::integer`],
        [`*`, [`::integer`, `::negative-number`], `::number`],
        [`*`, [`::integer`, `::negative-integer`], `::integer`],

        [`*`, [`::non-integer`, `::zero`], `::zero`],
        [`*`, [`::non-integer`, `::positive-integer`], `::non-zero-number`],
        [`*`, [`::non-integer`, `::positive-non-integer`], `::non-integer`],
        [`*`, [`::non-integer`, `::non-negative-integer`], `::number`],
        [`*`, [`::non-integer`, `::negative-number`], `::non-zero-number`],
        [`*`, [`::non-integer`, `::negative-integer`], `::non-zero-number`],

        [`*`, [`::number`, `::zero`], `::zero`],
        [`*`, [`::number`, `::positive-integer`], `::number`],
        [`*`, [`::number`, `::positive-non-integer`], `::number`],
        [`*`, [`::number`, `::non-negative-integer`], `::number`],
        [`*`, [`::number`, `::negative-number`], `::number`],
        [`*`, [`::number`, `::negative-integer`], `::number`],
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
        [`/`, [], { expression: `1` }],
        [`/`, [`::zero`], `::positive-infinity`],
        [`/`, [`::number`], [`::non-zero-number`, `::positive-infinity`]],
        [`/`, [`::integer`], [`::non-zero-number`, `::positive-infinity`]],
        [`/`, [`::non-zero-number`], `::non-zero-number`],
        [`/`, [`::non-zero-integer`], `::non-zero-number`],
        [`/`, [`::non-integer`], `::non-zero-number`],
        [`/`, [`::positive-number`], `::positive-number`],
        [`/`, [`::non-positive-number`], [`::negative-number`, `::positive-infinity`]],
        [`/`, [`::positive-integer`], `::positive-number`],
        [`/`, [`::positive-non-integer`], `::positive-number`],
        [`/`, [`::non-positive-integer`], [`::negative-number`, `::positive-infinity`]],
        [`/`, [`::negative-number`], `::negative-number`],
        [`/`, [`::non-negative-number`], [`::positive-number`, `::positive-infinity`]],
        [`/`, [`::negative-integer`], `::negative-number`],
        [`/`, [`::negative-non-integer`], `::negative-number`],
        [`/`, [`::non-negative-integer`], [`::positive-number`, `::positive-infinity`]],

        [`/`, [`::illegal-number`, `::zero`], [`::illegal-number`]],
        [`/`, [`::illegal-number`, `::illegal-number`], [`::nan`]],
        [`/`, [`::positive-infinity`, `::zero`], [`::positive-infinity`]],
        [`/`, [`::negative-infinity`, `::zero`], [`::negative-infinity`]],
        [`/`, [`::illegal-number`, `::non-zero-number`], [`::illegal-number`]],

        [`/`, [`::zero`, `::zero`], `::nan`],
        [`/`, [`::zero`, `::integer`], [`::nan`, `::zero`]],
        [`/`, [`::zero`, `::positive-integer`], `::zero`],
        [`/`, [`::zero`, `::positive-non-integer`], `::zero`],
        [`/`, [`::zero`, `::positive-number`], `::zero`],

        [`/`, [`::positive-number`, `::zero`], `::positive-infinity`],
        [`/`, [`::positive-number`, `::positive-integer`], `::positive-number`],
        [`/`, [`::positive-number`, `::positive-non-integer`], `::positive-number`],
        [`/`, [`::positive-number`, `::non-positive-integer`], [`::positive-infinity`, `::negative-number`]],
        [`/`, [`::positive-number`, `::negative-number`], `::negative-number`],

        [`/`, [`::positive-integer`, `::positive-infinity`], `::zero`],
        [`/`, [`::positive-integer`, `::positive-integer`], `::positive-number`],
        [`/`, [`::positive-integer`, `::positive-non-integer`], `::positive-number`],
        [`/`, [`::positive-integer`, `::non-negative-integer`], [`::positive-infinity`, `::positive-number`]],
        [`/`, [`::positive-integer`, `::negative-number`], `::negative-number`],
        [`/`, [`::positive-integer`, `::negative-integer`], `::negative-number`],

        [`/`, [`::positive-non-integer`, `::zero`], `::positive-infinity`],
        [`/`, [`::positive-non-integer`, `::positive-integer`], `::positive-non-integer`],
        [`/`, [`::positive-non-integer`, `::positive-non-integer`], [`::positive-number`]],
        [`/`, [`::positive-non-integer`, `::non-negative-integer`], [`::positive-infinity`, `::positive-non-integer`]],
        [`/`, [`::positive-non-integer`, `::negative-number`], `::negative-number`],
        [`/`, [`::positive-non-integer`, `::negative-integer`], `::negative-non-integer`],

        [`/`, [`::negative-integer`, `::zero`], `::negative-infinity`],
        [`/`, [`::negative-integer`, `::positive-integer`], `::negative-number`],
        [`/`, [`::negative-integer`, `::positive-non-integer`], `::negative-number`],
        [`/`, [`::negative-integer`, `::non-negative-integer`], [`::negative-number`, `::negative-infinity`]],
        [`/`, [`::negative-integer`, `::negative-number`], `::positive-number`],
        [`/`, [`::negative-integer`, `::negative-integer`], `::positive-number`],

        [`/`, [`::negative-non-integer`, `::zero`], `::negative-infinity`],
        [`/`, [`::negative-non-integer`, `::positive-integer`], `::negative-non-integer`],
        [`/`, [`::negative-non-integer`, `::positive-non-integer`], `::negative-number`],
        [`/`, [`::negative-non-integer`, `::non-negative-integer`], [`::negative-non-integer`, `::negative-infinity`]],
        [`/`, [`::negative-non-integer`, `::negative-number`], `::positive-number`],
        [`/`, [`::negative-non-integer`, `::negative-integer`], `::positive-non-integer`],

        [`/`, [`::negative-number`, `::zero`], `::negative-infinity`],
        [`/`, [`::negative-number`, `::positive-integer`], `::negative-number`],
        [`/`, [`::negative-number`, `::positive-non-integer`], `::negative-number`],
        [`/`, [`::negative-number`, `::non-positive-integer`], [`::positive-number`, `::negative-infinity`]],
        [`/`, [`::negative-number`, `::negative-number`], `::positive-number`],
        [
          `/`,
          [`::negative-integer`, `::positive-integer`, `::positive-integer`, `::negative-integer`],
          `::positive-number`,
        ],

        [`/`, [`::non-negative-integer`, `::zero`], [`::nan`, `::positive-infinity`]],
        [`/`, [`::non-negative-integer`, `::positive-integer`], `::non-negative-number`],
        [`/`, [`::non-negative-integer`, `::positive-non-integer`], `::non-negative-number`],
        [
          `/`,
          [`::non-negative-integer`, `::non-negative-integer`],
          [`::nan`, `::positive-infinity`, `::non-negative-number`],
        ],
        [`/`, [`::non-negative-integer`, `::negative-number`], `::non-positive-number`],
        [`/`, [`::non-negative-integer`, `::negative-integer`], `::non-positive-number`],

        [`/`, [`::non-positive-number`, `::zero`], [`::nan`, `::negative-infinity`]],
        [`/`, [`::non-positive-number`, `::positive-integer`], `::non-positive-number`],
        [`/`, [`::non-positive-number`, `::positive-non-integer`], `::non-positive-number`],
        [
          `/`,
          [`::non-positive-number`, `::non-positive-integer`],
          [`::non-negative-number`, `::nan`, `::negative-infinity`],
        ],
        [`/`, [`::non-positive-number`, `::negative-number`], `::non-negative-number`],

        [`/`, [`::non-positive-integer`, `::zero`], [`::nan`, `::negative-infinity`]],
        [`/`, [`::non-positive-integer`, `::positive-integer`], `::non-positive-number`],
        [`/`, [`::non-positive-integer`, `::positive-non-integer`], `::non-positive-number`],
        [
          `/`,
          [`::non-positive-integer`, `::non-negative-integer`],
          [`::nan`, `::non-positive-number`, `::negative-infinity`],
        ],
        [`/`, [`::non-positive-integer`, `::negative-number`], `::non-negative-number`],
        [`/`, [`::non-positive-integer`, `::negative-integer`], `::non-negative-number`],

        [`/`, [`::non-negative-number`, `::zero`], [`::nan`, `::positive-infinity`]],
        [`/`, [`::non-negative-number`, `::positive-integer`], `::non-negative-number`],
        [`/`, [`::non-negative-number`, `::positive-non-integer`], `::non-negative-number`],
        [
          `/`,
          [`::non-negative-number`, `::non-positive-integer`],
          [`::nan`, `::non-positive-number`, `::positive-infinity`],
        ],
        [`/`, [`::non-negative-number`, `::negative-number`], `::non-positive-number`],

        [`/`, [`::integer`, `::zero`], `::illegal-number`],
        [`/`, [`::integer`, `::positive-integer`], `::number`],
        [`/`, [`::integer`, `::positive-non-integer`], `::number`],
        [`/`, [`::integer`, `::non-negative-integer`], [`::illegal-number`, `::number`]],
        [`/`, [`::integer`, `::negative-number`], `::number`],
        [`/`, [`::integer`, `::negative-integer`], `::number`],

        [`/`, [`::non-integer`, `::zero`], [`::positive-infinity`, `::negative-infinity`]],
        [`/`, [`::non-integer`, `::positive-integer`], `::non-integer`],
        [`/`, [`::non-integer`, `::positive-non-integer`], `::non-zero-number`],
        [
          `/`,
          [`::non-integer`, `::non-negative-integer`],
          [`::non-integer`, `::positive-infinity`, `::negative-infinity`],
        ],
        [`/`, [`::non-integer`, `::negative-number`], `::non-zero-number`],
        [`/`, [`::non-integer`, `::negative-integer`], `::non-integer`],

        [`/`, [`::number`, `::zero`], `::illegal-number`],
        [`/`, [`::number`, `::positive-integer`], `::number`],
        [`/`, [`::number`, `::positive-non-integer`], `::number`],
        [`/`, [`::number`, `::non-negative-integer`], [`::illegal-number`, `::number`]],
        [`/`, [`::number`, `::negative-number`], `::number`],
        [`/`, [`::number`, `::negative-integer`], `::number`],
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
        [`sqrt`, [`::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`sqrt`, [`::nan`], `::nan`],
        [`sqrt`, [`::positive-infinity`], `::positive-infinity`],
        [`sqrt`, [`::negative-infinity`], `::nan`],
        [`sqrt`, [`::zero`], `::zero`],
        [`sqrt`, [`::number`], [`::non-negative-number`, `::nan`]],
        [`sqrt`, [`::integer`], [`::non-negative-number`, `::nan`]],
        [`sqrt`, [`::non-zero-number`], [`::positive-number`, `::nan`]],
        [`sqrt`, [`::non-zero-integer`], [`::positive-number`, `::nan`]],
        [`sqrt`, [`::non-integer`], [`::positive-non-integer`, `::nan`]],
        [`sqrt`, [`::positive-number`], `::positive-number`],
        [`sqrt`, [`::non-positive-number`], [`::nan`, `::zero`]],
        [`sqrt`, [`::positive-integer`], `::positive-number`],
        [`sqrt`, [`::positive-non-integer`], `::positive-non-integer`],
        [`sqrt`, [`::non-positive-integer`], [`::nan`, `::zero`]],
        [`sqrt`, [`::negative-number`], `::nan`],
        [`sqrt`, [`::non-negative-number`], `::non-negative-number`],
        [`sqrt`, [`::negative-integer`], `::nan`],
        [`sqrt`, [`::negative-non-integer`], `::nan`],
        [`sqrt`, [`::non-negative-integer`], `::non-negative-number`],

        [`sqrt`, [[`::non-negative-number`, `::nan`]], [`::non-negative-number`, `::nan`]],
        [`sqrt`, [[`::zero`, `::positive-non-integer`]], [`::zero`, `::positive-non-integer`]],
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
        [`cbrt`, [`::positive-infinity`], `::positive-infinity`],
        [`cbrt`, [`::negative-infinity`], `::negative-infinity`],
        [`cbrt`, [`::nan`], `::nan`],
        [`cbrt`, [`::zero`], `::zero`],
        [`cbrt`, [`::number`], `::number`],
        [`cbrt`, [`::integer`], `::number`],
        [`cbrt`, [`::non-zero-number`], `::non-zero-number`],
        [`cbrt`, [`::non-zero-integer`], `::non-zero-number`],
        [`cbrt`, [`::non-integer`], `::non-integer`],
        [`cbrt`, [`::positive-number`], `::positive-number`],
        [`cbrt`, [`::non-positive-number`], `::non-positive-number`],
        [`cbrt`, [`::positive-integer`], `::positive-number`],
        [`cbrt`, [`::positive-non-integer`], `::positive-non-integer`],
        [`cbrt`, [`::non-positive-integer`], `::non-positive-number`],
        [`cbrt`, [`::negative-number`], `::negative-number`],
        [`cbrt`, [`::non-negative-number`], `::non-negative-number`],
        [`cbrt`, [`::negative-integer`], `::negative-number`],
        [`cbrt`, [`::negative-non-integer`], `::negative-non-integer`],
        [`cbrt`, [`::non-negative-integer`], `::non-negative-number`],
        [
          `cbrt`,
          [{ expression: `(type-or ::zero ::positive-non-integer)` }],
          { expression: `(type-or ::zero ::positive-non-integer)` },
        ],
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
        [`pow`, [`::number`, `::nan`], `::nan`],
        [`pow`, [`::nan`, `::number`], [`::nan`, `::positive-integer`]],
        [`pow`, [`::nan`, `::nan`], `::nan`],

        [`pow`, [`::illegal-number`, `::illegal-number`], [`::positive-infinity`, `::nan`, `::zero`]],

        [`pow`, [`::positive-infinity`, `::positive-infinity`], `::positive-infinity`],
        [`pow`, [`::positive-infinity`, `::negative-infinity`], `::zero`],
        [`pow`, [`::positive-infinity`, `::number`], [`::non-negative-integer`, `::positive-infinity`]],
        [`pow`, [`::positive-infinity`, `::negative-number`], [`::zero`]],

        [`pow`, [`::negative-infinity`, `::positive-infinity`], `::positive-infinity`],
        [`pow`, [`::negative-infinity`, `::negative-infinity`], `::zero`],
        [
          `pow`,
          [`::negative-infinity`, `::number`],
          [`::zero`, `::positive-integer`, `::positive-infinity`, `::negative-infinity`],
        ],
        [`pow`, [`::negative-infinity`, `::negative-number`], [`::zero`]],

        [`pow`, [`::number`, `::number`], [`::number`, `::nan`, `::positive-infinity`]],
        [`pow`, [`::number`, `::illegal-number`], [`::zero`, `::nan`, `::positive-infinity`]],

        [`pow`, [`::non-integer`, `::number`], [`::non-zero-number`, `::nan`]],
        [`pow`, [`::non-integer`, `::negative-number`], [`::non-zero-number`, `::nan`]],

        [`pow`, [`::integer`, `::zero`], [`::positive-integer`]],
        [`pow`, [`::integer`, `::positive-number`], [`::non-negative-number`, `::negative-integer`, `::nan`]],
        [`pow`, [`::integer`, `::negative-number`], [`::non-zero-number`, `::nan`, `::positive-infinity`]],
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
  })

  describe(`rand!`, () => {
    test(`samples`, () => {
      expect(lits.run(`(rand!)`)).toBeLessThan(1)
      expect(lits.run(`(rand! 0.1)`)).toBeLessThan(0.1)
      expect(lits.run(`(rand! 0.1)`)).toBeGreaterThanOrEqual(0)
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

  describe(`max-safe-integer`, () => {
    test(`samples`, () => {
      expect(lits.run(`(max-safe-integer)`)).toBe(Number.MAX_SAFE_INTEGER)
      expect(() => lits.run(`(max-safe-integer :1)`)).toThrow()
    })
  })

  describe(`min-safe-integer`, () => {
    test(`samples`, () => {
      expect(lits.run(`(min-safe-integer)`)).toBe(Number.MIN_SAFE_INTEGER)
      expect(() => lits.run(`(min-safe-integer :1)`)).toThrow()
    })
  })

  describe(`max-value`, () => {
    test(`samples`, () => {
      expect(lits.run(`(max-value)`)).toBe(Number.MAX_VALUE)
      expect(() => lits.run(`(max-value :1)`)).toThrow()
    })
  })

  describe(`min-value`, () => {
    test(`samples`, () => {
      expect(lits.run(`(min-value)`)).toBe(Number.MIN_VALUE)
      expect(() => lits.run(`(min-value :1)`)).toThrow()
    })
  })

  describe(`epsilon`, () => {
    test(`samples`, () => {
      expect(lits.run(`(epsilon)`)).toBe(Number.EPSILON)
      expect(() => lits.run(`(epsilon :1)`)).toThrow()
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
      expect(lits.run(`(sinh 100)`)).toBe(Math.sinh(100))
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
      expect(lits.run(`(cosh 100)`)).toBe(Math.cosh(100))
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
            [`::number`, `::illegal-number`],
            [`::number`, `::illegal-number`],
          ],
          [`::integer`, `::illegal-number`],
        ],
        [`quot`, [`::number`, `::number`], [`::integer`, `::illegal-number`]],
        [`quot`, [`::number`, `::positive-number`], [`::integer`]],
        [`quot`, [`::number`, `::negative-number`], [`::integer`]],
        [`quot`, [`::number`, `::zero`], [`::illegal-number`]],
        [`quot`, [`::positive-number`, `::zero`], [`::positive-infinity`]],
        [`quot`, [`::negative-number`, `::zero`], [`::negative-infinity`]],
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
            [`::number`, `::illegal-number`],
            [`::number`, `::illegal-number`],
          ],
          [`::number`, `::nan`],
        ],
        [`mod`, [`::number`, `::number`], [`::number`, `::nan`]],
        [`mod`, [`::number`, `::positive-number`], [`::non-negative-number`]],
        [`mod`, [`::number`, `::negative-number`], [`::non-positive-number`]],
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
            [`::number`, `::illegal-number`],
            [`::number`, `::illegal-number`],
          ],
          [`::number`, `::nan`],
        ],
        [`rem`, [`::number`, `::number`], [`::number`, `::nan`]],
        [`rem`, [`::positive-number`, `::number`], [`::non-negative-number`, `::nan`]],
        [`rem`, [`::negative-number`, `::number`], [`::non-positive-number`, `::nan`]],
        [`rem`, [`::positive-number`, `::non-zero-number`], [`::non-negative-number`]],
        [`rem`, [`::negative-number`, `::non-zero-number`], [`::non-positive-number`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })
  // }
})
