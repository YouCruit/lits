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

      expect(lits.run(`(inc :1)`)).toBeNaN()
      expect(lits.run(`(inc false)`)).toBeNaN()
      expect(lits.run(`(inc true)`)).toBeNaN()
      expect(lits.run(`(inc nil)`)).toBeNaN()
      expect(lits.run(`(inc boolean)`)).toBeNaN()
      expect(lits.run(`(inc [])`)).toBeNaN()
      expect(lits.run(`(inc (object))`)).toBeNaN()

      expect(() => lits.run(`(inc)`)).toThrow()
      expect(() => lits.run(`(inc 1 1)`)).toThrow()
    })
    describe(`inc dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`inc`, [`::unknown`], [`::illegal-number`, `::float`]],

        [`inc`, [`::nan`], { value: NaN }],
        [`inc`, [`::positive-infinity`], { value: Infinity }],
        [`inc`, [`::negative-infinity`], { value: -Infinity }],

        [`inc`, [`::zero`], { value: 1 }],
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

      expect(lits.run(`(dec :1)`)).toBeNaN()
      expect(lits.run(`(dec false)`)).toBeNaN()
      expect(lits.run(`(dec true)`)).toBeNaN()
      expect(lits.run(`(dec nil)`)).toBeNaN()
      expect(lits.run(`(dec boolean)`)).toBeNaN()
      expect(lits.run(`(dec [])`)).toBeNaN()
      expect(lits.run(`(dec (object))`)).toBeNaN()

      expect(() => lits.run(`(dec)`)).toThrow()
      expect(() => lits.run(`(dec 1 1)`)).toThrow()
    })
    describe(`dec dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`dec`, [`::unknown`], [`::float`, `::illegal-number`]],

        [`dec`, [`::nan`], { value: NaN }],
        [`dec`, [`::positive-infinity`], { value: Infinity }],
        [`dec`, [`::negative-infinity`], { value: -Infinity }],

        [`dec`, [`::zero`], { value: -1 }],
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
      expect(lits.run(`(+ :1 2 3 4)`)).toBeNaN()
    })
    describe(`plus dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`+`, [`::zero`, { expression: `5` }], { value: 5 }],

        [`+`, [{ expression: `3` }, `::negative-integer`, { expression: `5` }], [`::integer`]],
        [`+`, [`::positive-infinity`, { expression: `5` }], { value: Infinity }],
        [`+`, [`::negative-infinity`, { expression: `5` }], { value: -Infinity }],
        [`+`, [`::negative-integer`, { expression: `5` }], [`::integer`]],

        [`+`, [`::unknown`, `::unknown`], [`::illegal-number`, `::float`]],
        [`+`, [`::unknown`, `::float`], [`::illegal-number`, `::float`]],
        [`+`, [`::float`, `::unknown`], [`::illegal-number`, `::float`]],

        [`+`, [`::illegal-number`], [`::illegal-number`]],
        [`+`, [`::nan`], { value: NaN }],
        [`+`, [`::positive-infinity`], { value: Infinity }],
        [`+`, [`::negative-infinity`], { value: -Infinity }],
        [`+`, [`::zero`], { value: 0 }],
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
        [`+`, [`::illegal-number`, `::nan`], { value: NaN }],
        [`+`, [`::illegal-number`, `::positive-infinity`], [`::positive-infinity`, `::nan`]],
        [`+`, [`::illegal-number`, `::negative-infinity`], [`::negative-infinity`, `::nan`]],
        [`+`, [`::illegal-number`, `::float`], [`::illegal-number`]],

        [`+`, [`::nan`, `::illegal-number`], { value: NaN }],
        [`+`, [`::nan`, `::nan`], { value: NaN }],
        [`+`, [`::nan`, `::positive-infinity`], { value: NaN }],
        [`+`, [`::nan`, `::negative-infinity`], { value: NaN }],
        [`+`, [`::nan`, `::float`], { value: NaN }],

        [`+`, [`::positive-infinity`, `::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`+`, [`::positive-infinity`, `::nan`], { value: NaN }],
        [`+`, [`::positive-infinity`, `::positive-infinity`], { value: Infinity }],
        [`+`, [`::positive-infinity`, `::negative-infinity`], { value: NaN }],
        [`+`, [`::positive-infinity`, `::float`], { value: Infinity }],

        [`+`, [`::negative-infinity`, `::illegal-number`], [`::negative-infinity`, `::nan`]],
        [`+`, [`::negative-infinity`, `::nan`], { value: NaN }],
        [`+`, [`::negative-infinity`, `::positive-infinity`], { value: NaN }],
        [`+`, [`::negative-infinity`, `::negative-infinity`], { value: -Infinity }],
        [`+`, [`::negative-infinity`, `::float`], { value: -Infinity }],

        [`+`, [`::zero`, `::zero`], { value: 0 }],
        [`+`, [`::zero`, `::integer`], [`::integer`]],
        [`+`, [`::zero`, `::positive-integer`], [`::positive-integer`]],
        [`+`, [`::zero`, `::positive-float`], [`::positive-float`]],
        [`+`, [`::zero`, `::positive-infinity`], { value: Infinity }],

        [`+`, [`::positive-float`, `::zero`], [`::positive-float`]],
        [`+`, [`::positive-float`, `::positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`+`, [`::positive-float`, `::non-positive-integer`], [`::float`]],
        [`+`, [`::positive-float`, `::negative-float`], [`::float`]],
        [`+`, [`::positive-float`, `::positive-float`], [`::positive-float`, `::positive-infinity`]],
        [`+`, [`::positive-float`, `::positive-infinity`], { value: Infinity }],

        [`+`, [`::positive-integer`, `::zero`], [`::positive-integer`]],
        [`+`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::positive-integer`, `::non-negative-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::positive-integer`, `::negative-float`], [`::float`]],
        [`+`, [`::positive-integer`, `::negative-integer`], [`::integer`]],
        [`+`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::positive-integer`, `::negative-infinity`], { value: -Infinity }],

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
        [`+`, [`::negative-float`, `::negative-infinity`], { value: -Infinity }],

        [`+`, [`::non-negative-integer`, `::zero`], [`::non-negative-integer`]],
        [`+`, [`::non-negative-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`+`, [`::non-negative-integer`, `::non-negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`+`, [`::non-negative-integer`, `::negative-float`], [`::float`]],
        [`+`, [`::non-negative-integer`, `::negative-integer`], [`::integer`]],
        [`+`, [`::non-negative-integer`, `::nan`], { value: NaN }],

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
        [`+`, [`::non-positive-integer`, `::positive-infinity`], { value: Infinity }],

        [`+`, [`::non-negative-float`, `::zero`], [`::non-negative-float`]],
        [`+`, [`::non-negative-float`, `::positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`+`, [`::non-negative-float`, `::non-positive-integer`], [`::float`]],
        [`+`, [`::non-negative-float`, `::negative-float`], [`::float`]],
        [`+`, [`::non-negative-float`, `::negative-infinity`], { value: -Infinity }],

        [`+`, [`::integer`, `::zero`], [`::integer`]],
        [`+`, [`::integer`, `::integer`], [`::integer`, `::infinity`]],
        [`+`, [`::integer`, `::positive-integer`], [`::integer`, `::positive-infinity`]],
        [`+`, [`::integer`, `::non-negative-integer`], [`::integer`, `::positive-infinity`]],
        [`+`, [`::integer`, `::negative-float`], [`::float`, `::negative-infinity`]],
        [`+`, [`::integer`, `::negative-integer`], [`::integer`, `::negative-infinity`]],
        [`+`, [`::integer`, `::nan`], { value: NaN }],

        [`+`, [`::float`, `::float`], [`::float`, `::infinity`]],
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
      expect(lits.run(`(- :1 2 3 4)`)).toBeNaN()
      expect(lits.run(`(- 1 :2 3 4)`)).toBeNaN()
    })
    test(`strange bug on minus`, () => {
      expect(lits.run(`(def a 0) (def b 2) (- a b)`)).toBe(-2)
    })
    describe(`minus dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`-`, [`::zero`, { expression: `5` }], { value: -5 }],
        [`-`, [`::zero`, { expression: `"5"` }], { value: NaN }],

        [
          `-`,
          [{ expression: `3` }, `::positive-integer`, { expression: `5` }],
          [`::negative-integer`, `::negative-infinity`],
        ],
        [`-`, [`::positive-infinity`, { expression: `5` }], { value: Infinity }],
        [`-`, [`::negative-infinity`, { expression: `5` }], { value: -Infinity }],
        [`-`, [`::negative-integer`, { expression: `5` }], [`::negative-integer`, `::negative-infinity`]],

        [`-`, [`::unknown`, `::unknown`], [`::illegal-number`, `::float`]],
        [`-`, [`::unknown`, `::float`], [`::illegal-number`, `::float`]],
        [`-`, [`::float`, `::unknown`], [`::illegal-number`, `::float`]],

        [`-`, [`::illegal-number`], [`::illegal-number`]],
        [`-`, [`::nan`], { value: NaN }],
        [`-`, [`::positive-infinity`], { value: -Infinity }],
        [`-`, [`::negative-infinity`], { value: Infinity }],

        [`-`, [`::zero`], { value: 0 }],
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
        [`-`, [`::illegal-number`, `::nan`], { value: NaN }],
        [`-`, [`::illegal-number`, `::positive-infinity`], [`::negative-infinity`, `::nan`]],
        [`-`, [`::illegal-number`, `::negative-infinity`], [`::positive-infinity`, `::nan`]],
        [`-`, [`::illegal-number`, `::float`], [`::illegal-number`]],

        [`-`, [`::nan`, `::illegal-number`], { value: NaN }],
        [`-`, [`::nan`, `::nan`], { value: NaN }],
        [`-`, [`::nan`, `::positive-infinity`], { value: NaN }],
        [`-`, [`::nan`, `::negative-infinity`], { value: NaN }],
        [`-`, [`::nan`, `::float`], { value: NaN }],

        [`-`, [`::positive-infinity`, `::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`-`, [`::positive-infinity`, `::nan`], { value: NaN }],
        [`-`, [`::positive-infinity`, `::positive-infinity`], { value: NaN }],
        [`-`, [`::positive-infinity`, `::negative-infinity`], { value: Infinity }],
        [`-`, [`::positive-infinity`, `::float`], { value: Infinity }],

        [`-`, [`::negative-infinity`, `::illegal-number`], [`::negative-infinity`, `::nan`]],
        [`-`, [`::negative-infinity`, `::nan`], { value: NaN }],
        [`-`, [`::negative-infinity`, `::positive-infinity`], { value: -Infinity }],
        [`-`, [`::negative-infinity`, `::negative-infinity`], { value: NaN }],
        [`-`, [`::negative-infinity`, `::float`], { value: -Infinity }],

        [`-`, [`::zero`, `::zero`], { value: 0 }],
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
      expect(lits.run(`(* :1 2 3 4)`)).toBeNaN()
    })
    describe(`multiplication dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [
          `*`,
          [{ expression: `3` }, `::negative-integer`, { expression: `5` }],
          [`::negative-integer`, `::negative-infinity`],
        ],

        [`*`, [`::unknown`, `::unknown`], [`::illegal-number`, `::float`]],
        [`*`, [`::unknown`, `::float`], [`::illegal-number`, `::float`]],
        [`*`, [`::float`, `::unknown`], [`::illegal-number`, `::float`]],

        [`*`, [`::illegal-number`], [`::illegal-number`]],
        [`*`, [`::zero`], { value: 0 }],
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

        [`*`, [`::infinity`, `::zero`], { value: 0 }],
        [`*`, [`::illegal-number`, `::zero`], { value: 0 }],
        [`*`, [`::illegal-number`, `::non-zero-float`], [`::positive-infinity`, `::negative-infinity`, `::nan`]],
        [`*`, [`::illegal-number`, `::illegal-number`], [`::illegal-number`]],

        [`*`, [`::zero`, `::illegal-number`], { value: 0 }],
        [`*`, [`::zero`, `::zero`], { value: 0 }],
        [`*`, [`::zero`, `::integer`], { value: 0 }],
        [`*`, [`::zero`, `::positive-integer`], { value: 0 }],
        [`*`, [`::zero`, `::positive-float`], { value: 0 }],

        [`*`, [`::positive-float`, `::zero`], { value: 0 }],
        [`*`, [`::positive-float`, `::positive-integer`], [`::positive-float`, `::positive-infinity`]],
        [`*`, [`::positive-float`, `::non-positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::positive-float`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],

        [`*`, [`::positive-integer`, `::zero`], { value: 0 }],
        [`*`, [`::positive-integer`, `::positive-integer`], [`::positive-integer`, `::positive-infinity`]],
        [`*`, [`::positive-integer`, `::non-negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`*`, [`::positive-integer`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`*`, [`::positive-integer`, `::negative-integer`], [`::negative-integer`, `::negative-infinity`]],

        [`*`, [`::negative-integer`, `::zero`], { value: 0 }],
        [`*`, [`::negative-integer`, `::positive-integer`], [`::negative-integer`, `::negative-infinity`]],
        [`*`, [`::negative-integer`, `::non-negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`*`, [`::negative-integer`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`*`, [`::negative-integer`, `::negative-integer`], [`::positive-integer`, `::positive-infinity`]],

        [`*`, [`::negative-float`, `::zero`], { value: 0 }],
        [`*`, [`::negative-float`, `::positive-integer`], [`::negative-float`, `::negative-infinity`]],
        [`*`, [`::negative-float`, `::non-positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::negative-float`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],

        [`*`, [`::non-negative-integer`, `::zero`], { value: 0 }],
        [`*`, [`::non-negative-integer`, `::positive-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`*`, [`::non-negative-integer`, `::non-negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],
        [`*`, [`::non-negative-integer`, `::negative-float`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::non-negative-integer`, `::negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],

        [`*`, [`::non-positive-float`, `::zero`], { value: 0 }],
        [`*`, [`::non-positive-float`, `::positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::non-positive-float`, `::non-positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::non-positive-float`, `::negative-float`], [`::non-negative-float`, `::positive-infinity`]],

        [`*`, [`::non-positive-integer`, `::zero`], { value: 0 }],
        [`*`, [`::non-positive-integer`, `::positive-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`*`, [`::non-positive-integer`, `::non-negative-integer`], [`::non-positive-integer`, `::negative-infinity`]],
        [`*`, [`::non-positive-integer`, `::negative-float`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::non-positive-integer`, `::negative-integer`], [`::non-negative-integer`, `::positive-infinity`]],

        [`*`, [`::non-negative-float`, `::zero`], { value: 0 }],
        [`*`, [`::non-negative-float`, `::positive-integer`], [`::non-negative-float`, `::positive-infinity`]],
        [`*`, [`::non-negative-float`, `::non-positive-integer`], [`::non-positive-float`, `::negative-infinity`]],
        [`*`, [`::non-negative-float`, `::negative-float`], [`::non-positive-float`, `::negative-infinity`]],

        [`*`, [`::integer`, `::zero`], { value: 0 }],
        [`*`, [`::integer`, `::positive-integer`], [`::integer`, `::infinity`]],
        [`*`, [`::integer`, `::non-negative-integer`], [`::integer`, `::infinity`]],
        [`*`, [`::integer`, `::negative-float`], [`::float`, `::infinity`]],
        [`*`, [`::integer`, `::negative-integer`], [`::integer`, `::infinity`]],

        [`*`, [`::float`, `::zero`], { value: 0 }],
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
      expect(lits.run(`(/ -2 (infinity))`)).toBe(0)
      expect(lits.run(`(/ 1 2 3 4)`)).toBe(1 / 2 / 3 / 4)
      expect(lits.run(`(/ :1 2 3 4)`)).toBeNaN()
      expect(lits.run(`(/ 1 :foo 3 4)`)).toBeNaN()
    })
    describe(`division dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`/`, [`::unknown`, `::unknown`], [`::illegal-number`, `::float`]],
        [`/`, [`::unknown`, `::float`], [`::illegal-number`, `::float`]],
        [`/`, [`::float`, `::unknown`], [`::illegal-number`, `::float`]],

        [`/`, [`::zero`], { value: Infinity }],
        [`/`, [`::positive-infinity`], { value: 0 }],
        [`/`, [`::negative-infinity`], { value: 0 }],
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
        [`/`, [`::positive-infinity`, `::zero`], { value: Infinity }],
        [`/`, [`::negative-infinity`, `::zero`], { value: -Infinity }],
        [`/`, [`::illegal-number`, `::non-zero-float`], [`::illegal-number`]],

        [`/`, [`::zero`, `::illegal-number`], { value: 0 }],
        [`/`, [`::zero`, `::zero`], { value: 0 }],
        [`/`, [`::zero`, `::integer`], { value: 0 }],
        [`/`, [`::zero`, `::positive-integer`], { value: 0 }],
        [`/`, [`::zero`, `::positive-float`], { value: 0 }],

        [`/`, [`::positive-float`, `::zero`], { value: Infinity }],
        [`/`, [`::positive-float`, `::positive-integer`], [`::positive-float`]],
        [`/`, [`::positive-float`, `::positive-infinity`], { value: 0 }],
        [`/`, [`::positive-float`, `::non-positive-integer`], [`::positive-infinity`, `::negative-float`]],
        [`/`, [`::positive-float`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],

        [`/`, [`::positive-integer`, `::positive-infinity`], { value: 0 }],
        [`/`, [`::positive-integer`, `::positive-integer`], [`::positive-float`]],
        [`/`, [`::positive-integer`, `::non-negative-integer`], [`::positive-infinity`, `::positive-float`]],
        [`/`, [`::positive-integer`, `::negative-float`], [`::negative-float`, `::negative-infinity`]],
        [`/`, [`::positive-integer`, `::negative-integer`], [`::negative-float`]],

        [`/`, [`::negative-integer`, `::zero`], { value: -Infinity }],
        [`/`, [`::negative-integer`, `::positive-integer`], [`::negative-float`]],
        [`/`, [`::negative-integer`, `::non-negative-integer`], [`::negative-float`, `::negative-infinity`]],
        [`/`, [`::negative-integer`, `::negative-float`], [`::positive-float`, `::positive-infinity`]],
        [`/`, [`::negative-integer`, `::negative-integer`], [`::positive-float`]],

        [`/`, [`::negative-float`, `::zero`], { value: -Infinity }],
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
      expect(lits.run(`(sqrt :foo)`)).toBeNaN()
      expect(lits.run(`(sqrt -3)`)).toBeNaN()
      expect(lits.run(`(sqrt 0)`)).toBe(0)
      expect(lits.run(`(sqrt 1)`)).toBe(1)
      expect(lits.run(`(sqrt 4)`)).toBe(2)
    })
    describe(`sqrt dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`sqrt`, [`::unknown`], [`::nan`, `::positive-infinity`, `::non-negative-float`]],

        [`sqrt`, [`::illegal-number`], [`::positive-infinity`, `::nan`]],
        [`sqrt`, [`::nan`], { value: NaN }],
        [`sqrt`, [`::positive-infinity`], { value: Infinity }],
        [`sqrt`, [`::negative-infinity`], { value: NaN }],
        [`sqrt`, [`::zero`], { value: 0 }],
        [`sqrt`, [`::float`], [`::non-negative-float`, `::nan`]],
        [`sqrt`, [`::integer`], [`::non-negative-float`, `::nan`]],
        [`sqrt`, [`::non-zero-float`], [`::positive-float`, `::nan`]],
        [`sqrt`, [`::non-zero-integer`], [`::positive-float`, `::nan`]],
        [`sqrt`, [`::positive-float`], [`::positive-float`]],
        [`sqrt`, [`::non-positive-float`], [`::nan`, `::zero`]],
        [`sqrt`, [`::positive-integer`], [`::positive-float`]],
        [`sqrt`, [`::non-positive-integer`], [`::nan`, `::zero`]],
        [`sqrt`, [`::negative-float`], { value: NaN }],
        [`sqrt`, [`::non-negative-float`], [`::non-negative-float`]],
        [`sqrt`, [`::negative-integer`], { value: NaN }],
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
      expect(lits.run(`(cbrt :foo)`)).toBeNaN()

      expect(lits.run(`(cbrt -8)`)).toBe(-2)
      expect(lits.run(`(cbrt 0)`)).toBe(0)
      expect(lits.run(`(cbrt 1)`)).toBe(1)
      expect(lits.run(`(cbrt 8)`)).toBe(2)
      expect(lits.run(`(cbrt 12)`)).toBe(Math.cbrt(12))
    })
    describe(`cbrt dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`cbrt`, [`::unknown`], [`::illegal-number`, `::float`]],

        [`cbrt`, [`::positive-infinity`], { value: Infinity }],
        [`cbrt`, [`::negative-infinity`], { value: -Infinity }],
        [`cbrt`, [`::nan`], { value: NaN }],
        [`cbrt`, [`::zero`], { value: 0 }],
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

      expect(lits.run(`(pow :3 4)`)).toBeNaN()
      expect(lits.run(`(pow 3 :4)`)).toBeNaN()

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
        [`pow`, [`::unknown`, `::positive-integer`], [`::illegal-number`, `::float`]],
        [`pow`, [`::positive-integer`, `::unknown`], [`::non-negative-float`, `::nan`, `::positive-infinity`]],
        [`pow`, [`::unknown`, `::unknown`], [`::illegal-number`, `::float`]],

        [`pow`, [`::float`, `::nan`], { value: NaN }],
        [`pow`, [`::nan`, `::float`], [`::nan`, `::positive-integer`]],
        [`pow`, [`::nan`, `::nan`], { value: NaN }],

        [`pow`, [`::illegal-number`, `::illegal-number`], [`::positive-infinity`, `::nan`, `::zero`]],

        [`pow`, [`::positive-infinity`, `::positive-infinity`], { value: Infinity }],
        [`pow`, [`::positive-infinity`, `::negative-infinity`], { value: 0 }],
        [`pow`, [`::positive-infinity`, `::float`], [`::non-negative-integer`, `::positive-infinity`]],
        [`pow`, [`::positive-infinity`, `::negative-float`], { value: 0 }],

        [`pow`, [`::negative-infinity`, `::positive-infinity`], { value: NaN }],
        [`pow`, [`::negative-infinity`, `::negative-infinity`], { value: 0 }],
        [
          `pow`,
          [`::negative-infinity`, `::float`],
          [`::zero`, `::positive-integer`, `::positive-infinity`, `::negative-infinity`],
        ],
        [`pow`, [`::negative-infinity`, `::negative-float`], { value: 0 }],

        [`pow`, [`::float`, `::float`], [`::illegal-number`, `::float`]],
        [`pow`, [`::float`, `::integer`], [`::positive-infinity`, `::negative-infinity`, `::float`]],
        [`pow`, [`::float`, `::illegal-number`], [`::non-negative-integer`, `::nan`, `::positive-infinity`]],

        [`pow`, [`::integer`, `::zero`], [`::positive-integer`]],
        [`pow`, [`::integer`, `::integer`], [`::infinity`, `::float`]],
        [`pow`, [`::integer`, `::positive-float`], [`::illegal-number`, `::non-negative-float`, `::negative-integer`]],
        [`pow`, [`::integer`, `::negative-float`], [`::nan`, `::float`, `::positive-infinity`]],

        [`pow`, [`::negative-integer`, `::positive-infinity`], { value: NaN }],
        [`pow`, [`::positive-integer`, `::positive-infinity`], [`::positive-integer`, `::positive-infinity`]],
        [`pow`, [`::negative-float`, `::positive-infinity`], [`::nan`, `::zero`]],
        [`pow`, [`::positive-float`, `::positive-infinity`], [`::zero`, `::positive-integer`, `::positive-infinity`]],

        [`pow`, [`::negative-integer`, `::negative-infinity`], [`::nan`, `::zero`]],
        [`pow`, [`::positive-integer`, `::negative-infinity`], [`::non-negative-integer`]],
        [`pow`, [`::positive-integer`, `::float`], [`::non-negative-float`, `::positive-infinity`]],
        [`pow`, [`::negative-float`, `::negative-infinity`], [`::nan`, `::zero`]],
        [`pow`, [`::positive-float`, `::negative-infinity`], [`::non-negative-integer`, `::positive-infinity`]],

        [`pow`, [`::non-zero-number`, `::zero`], { value: 1 }],
        [`pow`, [`::positive-float`, `::zero`], { value: 1 }],
        [`pow`, [`::negative-float`, `::zero`], { value: 1 }],
        [`pow`, [`::negative-infinity`, `::zero`], { value: 1 }],
        [`pow`, [`::positive-infinity`, `::zero`], { value: 1 }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`round`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(round)`)).toThrow()
      expect(() => lits.run(`(round 3 4 5)`)).toThrow()
      expect(lits.run(`(round :0)`)).toBeNaN()
      expect(lits.run(`(round 1 :0)`)).toBeNaN()

      expect(lits.run(`(round 0)`)).toBe(0)
      expect(lits.run(`(round 1)`)).toBe(1)
      expect(lits.run(`(round 0.4)`)).toBe(0)
      expect(lits.run(`(round 0.5)`)).toBe(1)
      expect(lits.run(`(round 0.6)`)).toBe(1)
      expect(lits.run(`(round -0.4)`)).toBe(0)
      expect(lits.run(`(round -0.5)`)).toBe(0)
      expect(lits.run(`(round -0.6)`)).toBe(-1)
      expect(lits.run(`(round -0.125 1)`)).toBe(-0.1)
      expect(lits.run(`(round 0.125 2)`)).toBe(0.13)
    })
    describe(`round dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`round`, [`::unknown`], [`::illegal-number`, `::integer`]],

        [`round`, [`::positive-infinity`], { value: Infinity }],
        [`round`, [`::negative-infinity`], { value: -Infinity }],
        [`round`, [`::nan`], { value: NaN }],
        [`round`, [`::positive-infinity`, `::positive-infinity`], { value: NaN }],
        [`round`, [`::negative-infinity`, `::negative-infinity`], { value: NaN }],
        [`round`, [`::nan`, `::nan`], { value: NaN }],
        [`round`, [`::illegal-number`, `::illegal-number`], { value: NaN }],

        [`round`, [`::float`], [`::integer`]],
        [`round`, [`::positive-float`], [`::non-negative-integer`]],
        [`round`, [`::positive-integer`], [`::positive-integer`]],
        [`round`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`round`, [`::negative-float`], [`::non-positive-integer`]],
        [`round`, [`::non-negative-float`], [`::non-negative-integer`]],

        [`round`, [`::float`, `::float`], [`::nan`, `::float`]],
        [`round`, [`::float`, `::integer`], [`::nan`, `::float`]],
        [`round`, [`::float`, `::positive-integer`], [`::float`]],
        [`round`, [`::float`, `::nan`], { value: NaN }],
        [`round`, [`::float`, `::positive-infinity`], { value: NaN }],
        [`round`, [`::float`, `::negative-infinity`], { value: NaN }],
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
      expect(lits.run(`(floor :0)`)).toBeNaN()

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
        [`floor`, [`::unknown`], [`::illegal-number`, `::integer`]],
        [`floor`, [`::positive-infinity`], { value: Infinity }],
        [`floor`, [`::negative-infinity`], { value: -Infinity }],
        [`floor`, [`::nan`], { value: NaN }],
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
      expect(lits.run(`(ceil :0)`)).toBeNaN()
      expect(lits.run(`(ceil 0)`)).toBe(0)
      expect(lits.run(`(ceil 1)`)).toBe(1)
      expect(lits.run(`(ceil 0.4)`)).toBe(1)
      expect(lits.run(`(ceil 0.5)`)).toBe(1)
      expect(lits.run(`(ceil 0.6)`)).toBe(1)
      expect(lits.run(`(ceil -0.4)`)).toBe(0)
      expect(lits.run(`(ceil -0.5)`)).toBe(0)
      expect(lits.run(`(ceil -0.6)`)).toBe(0)
    })
    describe(`ceil dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`ceil`, [`::unknown`], [`::illegal-number`, `::integer`]],

        [`ceil`, [`::positive-infinity`], { value: Infinity }],
        [`ceil`, [`::negative-infinity`], { value: -Infinity }],
        [`ceil`, [`::nan`], { value: NaN }],
        [`ceil`, [`::illegal-number`], [`::illegal-number`]],

        [`ceil`, [`::float`], [`::integer`]],
        [`ceil`, [`::positive-float`], [`::positive-integer`]],
        [`ceil`, [`::positive-integer`], [`::positive-integer`]],
        [`ceil`, [`::negative-integer`], [`::negative-integer`]],
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
      expect(lits.run(`(trunc -0.99)`)).toBe(0)
      expect(lits.run(`(trunc -0.1)`)).toBe(0)

      expect(lits.run(`(trunc :foo)`)).toBeNaN()
      expect(() => lits.run(`(trunc)`)).toThrow()
      expect(() => lits.run(`(trunc 100 200)`)).toThrow()
    })
    describe(`trunc dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`trunc`, [`::unknown`], [`::illegal-number`, `::integer`]],

        [`trunc`, [`::positive-infinity`], { value: Infinity }],
        [`trunc`, [`::negative-infinity`], { value: -Infinity }],
        [`trunc`, [`::nan`], { value: NaN }],
        [`trunc`, [`::illegal-number`], [`::illegal-number`]],

        [`trunc`, [`::float`], [`::integer`]],
        [`trunc`, [`::positive-float`], [`::non-negative-integer`]],
        [`trunc`, [`::positive-integer`], [`::positive-integer`]],
        [`trunc`, [`::negative-integer`], [`::negative-integer`]],
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

      expect(lits.run(`(rand-int! :x)`)).toBeNaN()

      expect(() => lits.run(`(rand-int!)`)).toThrow()
      expect(() => lits.run(`(rand-int! 1 2)`)).toThrow()
    })
    describe(`rand-int! dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`rand-int!`, [`::unknown`], [`::illegal-number`, `::integer`]],

        [`rand-int!`, [`::positive-infinity`], { value: Infinity }],
        [`rand-int!`, [`::negative-infinity`], { value: -Infinity }],
        [`rand-int!`, [`::nan`], { value: NaN }],
        [`rand-int!`, [`::illegal-number`], [`::illegal-number`]],

        [`rand-int!`, [`::float`], [`::integer`]],
        [`rand-int!`, [`::positive-float`], [`::non-negative-integer`]],
        [`rand-int!`, [`::positive-integer`], [`::non-negative-integer`]],
        [`rand-int!`, [`::non-positive-float`], [`::non-positive-integer`]],
        [`rand-int!`, [`::negative-float`], [`::non-positive-integer`]],
        [`rand-int!`, [`::non-negative-float`], [`::non-negative-integer`]],
        [`rand-int!`, [`::zero`], { value: 0 }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`min`, () => {
    test(`samples`, () => {
      expect(lits.run(`(min 1)`)).toBe(1)
      expect(lits.run(`(min 1 -2)`)).toBe(-2)
      expect(lits.run(`(min 3 1 2 )`)).toBe(1)

      expect(lits.run(`(min :1)`)).toBeNaN()
      expect(lits.run(`(min 1 :3)`)).toBeNaN()
      expect(lits.run(`(min :1 3)`)).toBeNaN()
      expect(lits.run(`(min :1 :3)`)).toBeNaN()

      expect(() => lits.run(`(min)`)).toThrow()
    })
    describe(`min dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`min`, [`::unknown`], [`::number-or-nan`]],
        [`min`, [`::negative-infinity`, `::nan`], { value: NaN }],
        [`min`, [`::negative-infinity`, `::float`], { value: -Infinity }],
        [`min`, [`::negative-infinity`, [`::nan`, `::float`]], [`::negative-infinity`, `::nan`]],
        [`min`, [`::non-negative-float`, [`::negative-float`]], [`::negative-float`]],
        [`min`, [[`::negative-infinity`, `::positive-infinity`], [`::float`]], [`::negative-infinity`, `::float`]],
        [
          `min`,
          [[`::negative-infinity`, `::positive-infinity`], [`::non-positive-integer`]],
          [`::negative-infinity`, `::non-positive-integer`],
        ],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`max`, () => {
    test(`samples`, () => {
      expect(lits.run(`(max 1)`)).toBe(1)
      expect(lits.run(`(max 1 -2)`)).toBe(1)
      expect(lits.run(`(max 3 1 2 )`)).toBe(3)

      expect(lits.run(`(max :1)`)).toBeNaN()
      expect(lits.run(`(max :1 3)`)).toBeNaN()
      expect(lits.run(`(max 1 :3)`)).toBeNaN()
      expect(lits.run(`(max :1 :3)`)).toBeNaN()

      expect(() => lits.run(`(max)`)).toThrow()
    })
    describe(`max dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`max`, [`::unknown`], [`::number-or-nan`]],
        [`max`, [`::negative-infinity`, `::nan`], { value: NaN }],
        [`max`, [`::negative-infinity`, `::float`], [`::float`]],
        [`max`, [`::positive-infinity`, `::float`], { value: Infinity }],
        [`max`, [`::negative-infinity`, [`::nan`, `::float`]], [`::float`, `::nan`]],
        [`max`, [`::non-negative-float`, [`::negative-float`]], [`::non-negative-float`]],
        [`max`, [`::non-positive-float`, [`::negative-float`]], [`::non-positive-float`]],
        [`max`, [`::positive-float`, [`::negative-float`]], [`::positive-float`]],
        [`max`, [`::positive-float`, [`::negative-float`]], [`::positive-float`]],
        [`max`, [[`::negative-infinity`, `::positive-infinity`], [`::float`]], [`::positive-infinity`, `::float`]],
        [
          `max`,
          [[`::negative-infinity`, `::positive-infinity`], [`::non-positive-integer`]],
          [`::positive-infinity`, `::non-positive-integer`],
        ],
      ]
      testTypeEvaluations(lits, typeEvaluations)
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

  describe(`infinity`, () => {
    test(`samples`, () => {
      expect(lits.run(`(infinity)`)).toBe(Infinity)
      expect(() => lits.run(`(infinity :1)`)).toThrow()
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

      expect(lits.run(`(abs :foo)`)).toBeNaN()

      expect(() => lits.run(`(abs)`)).toThrow()
      expect(() => lits.run(`(abs 1 2)`)).toThrow()
    })
    describe(`abs dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`abs`, [`::string`], { value: NaN }],
        [`abs`, [`::unknown`], [`::nan`, `::positive-infinity`, `::non-negative-float`]],
        [`abs`, [`::number-or-nan`], [`::non-negative-number`, `::nan`]],
        [`abs`, [`::float`], [`::non-negative-float`]],
        [`abs`, [`::negative-float`], [`::positive-float`]],
        [`abs`, [`::negative-number`], [`::positive-number`]],
        [`abs`, [`::positive-number`], [`::positive-number`]],
        [`abs`, [`::illegal-number`], [`::positive-infinity`, `::nan`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`sign`, () => {
    test(`samples`, () => {
      expect(lits.run(`(sign 2)`)).toBe(1)
      expect(lits.run(`(sign -2)`)).toBe(-1)
      expect(lits.run(`(sign -0)`)).toBe(0)
      expect(lits.run(`(sign 0)`)).toBe(0)

      expect(lits.run(`(sign :foo)`)).toBeNaN()

      expect(() => lits.run(`(sign)`)).toThrow()
      expect(() => lits.run(`(sign 1 2)`)).toThrow()
    })
    describe(`sign dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`sign`, [`::string`], { value: NaN }],
        [`sign`, [`::unknown`], [`::integer`, `::nan`]],
        [`sign`, [`::number-or-nan`], [`::integer`, `::nan`]],
        [`sign`, [`::number`], [`::integer`]],
        [`sign`, [`::positive-number`], { value: 1 }],
        [`sign`, [`::float`], [`::integer`]],
        [`sign`, [`::positive-float`], { value: 1 }],
        [`sign`, [`::non-positive-number`], [`::non-positive-integer`]],
        [`sign`, [`::non-negative-number`], [`::non-negative-integer`]],
        [`sign`, [`::negative-float`], { value: -1 }],
        [`sign`, [`::zero`], { value: 0 }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`exp`, () => {
    test(`samples`, () => {
      expect(lits.run(`(exp 1)`)).toBe(Math.exp(1))
      expect(lits.run(`(exp -2)`)).toBe(Math.exp(-2))
      expect(lits.run(`(exp -0)`)).toBe(Math.exp(-0))
      expect(lits.run(`(exp 0)`)).toBe(Math.exp(0))

      expect(lits.run(`(exp :foo)`)).toBeNaN()

      expect(() => lits.run(`(exp)`)).toThrow()
      expect(() => lits.run(`(exp 1 2)`)).toThrow()
    })
    describe(`exp dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`exp`, [`::string`], { value: NaN }],
        [`exp`, [`::positive-infinity`], { value: Infinity }],
        [`exp`, [`::negative-infinity`], { value: 0 }],
        [`exp`, [`::zero`], { value: 1 }],
        [`exp`, [`::unknown`], [`::non-negative-number`, `::nan`]],
        [`exp`, [`::number-or-nan`], [`::non-negative-number`, `::nan`]],
        [`exp`, [`::number`], [`::non-negative-number`]],
        [`exp`, [`::positive-number`], [`::positive-number`]],
        [`exp`, [`::float`], [`::non-negative-number`]],
        [`exp`, [`::positive-float`], [`::positive-number`]],
        [`exp`, [`::non-positive-number`], [`::non-negative-float`]],
        [`exp`, [`::non-negative-number`], [`::positive-number`]],
        [`exp`, [`::negative-float`], [`::non-negative-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`log.`, () => {
    test(`samples`, () => {
      expect(lits.run(`(log 0.1)`)).toBe(Math.log(0.1))
      expect(lits.run(`(log 1)`)).toBe(Math.log(1))
      expect(lits.run(`(log 100)`)).toBe(Math.log(100))
      expect(lits.run(`(log -2)`)).toBeNaN()
      expect(lits.run(`(log 0)`)).toBe(-Infinity)
      expect(lits.run(`(log -0)`)).toBe(-Infinity)

      expect(lits.run(`(log :foo)`)).toBeNaN()

      expect(() => lits.run(`(log)`)).toThrow()
      expect(() => lits.run(`(log 1 2)`)).toThrow()
    })
    describe(`log dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`log`, [`::string`], { value: NaN }],
        [`log`, [`::positive-infinity`], { value: Infinity }],
        [`log`, [`::negative-infinity`], { value: NaN }],
        [`log`, [`::zero`], { value: -Infinity }],
        [`log`, [`::unknown`], [`::number-or-nan`]],
        [`log`, [`::number-or-nan`], [`::number-or-nan`]],
        [`log`, [`::number`], [`::number-or-nan`]],
        [`log`, [`::positive-number`], [`::float`, `::positive-infinity`]],
        [`log`, [`::float`], [`::float`, `::negative-infinity`, `::nan`]],
        [`log`, [`::positive-float`], [`::float`]],
        [`log`, [`::non-positive-number`], [`::negative-infinity`, `::nan`]],
        [`log`, [`::non-negative-number`], [`::number`]],
        [`log`, [`::negative-float`], { value: NaN }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`log2.`, () => {
    test(`samples`, () => {
      expect(lits.run(`(log2 0.1)`)).toBe(Math.log2(0.1))
      expect(lits.run(`(log2 1)`)).toBe(Math.log2(1))
      expect(lits.run(`(log2 100)`)).toBe(Math.log2(100))
      expect(lits.run(`(log2 -2)`)).toBeNaN()
      expect(lits.run(`(log2 0)`)).toBe(-Infinity)
      expect(lits.run(`(log2 -0)`)).toBe(-Infinity)

      expect(lits.run(`(log2 :foo)`)).toBeNaN()

      expect(() => lits.run(`(log2)`)).toThrow()
      expect(() => lits.run(`(log2 1 2)`)).toThrow()
    })
    describe(`log2 dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`log2`, [`::string`], { value: NaN }],
        [`log2`, [`::positive-infinity`], { value: Infinity }],
        [`log2`, [`::negative-infinity`], { value: NaN }],
        [`log2`, [`::zero`], { value: -Infinity }],
        [`log2`, [`::unknown`], [`::number-or-nan`]],
        [`log2`, [`::number-or-nan`], [`::number-or-nan`]],
        [`log2`, [`::number`], [`::number-or-nan`]],
        [`log2`, [`::positive-number`], [`::float`, `::positive-infinity`]],
        [`log2`, [`::float`], [`::float`, `::negative-infinity`, `::nan`]],
        [`log2`, [`::positive-float`], [`::float`]],
        [`log2`, [`::non-positive-number`], [`::negative-infinity`, `::nan`]],
        [`log2`, [`::non-negative-number`], [`::number`]],
        [`log2`, [`::negative-float`], { value: NaN }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`log10`, () => {
    test(`samples`, () => {
      expect(lits.run(`(log10 0.1)`)).toBe(Math.log10(0.1))
      expect(lits.run(`(log10 1)`)).toBe(Math.log10(1))
      expect(lits.run(`(log10 100)`)).toBe(Math.log10(100))
      expect(lits.run(`(log10 -2)`)).toBeNaN()
      expect(lits.run(`(log10 0)`)).toBe(-Infinity)
      expect(lits.run(`(log10 -0)`)).toBe(-Infinity)

      expect(lits.run(`(log10 :foo)`)).toBeNaN()

      expect(() => lits.run(`(log10)`)).toThrow()
      expect(() => lits.run(`(log10 1 2)`)).toThrow()
    })
    describe(`log10 dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`log10`, [`::string`], { value: NaN }],
        [`log10`, [`::positive-infinity`], { value: Infinity }],
        [`log10`, [`::negative-infinity`], { value: NaN }],
        [`log10`, [`::zero`], { value: -Infinity }],
        [`log10`, [`::unknown`], [`::number-or-nan`]],
        [`log10`, [`::number-or-nan`], [`::number-or-nan`]],
        [`log10`, [`::number`], [`::number-or-nan`]],
        [`log10`, [`::positive-number`], [`::float`, `::positive-infinity`]],
        [`log10`, [`::float`], [`::float`, `::negative-infinity`, `::nan`]],
        [`log10`, [`::positive-float`], [`::float`]],
        [`log10`, [`::non-positive-number`], [`::negative-infinity`, `::nan`]],
        [`log10`, [`::non-negative-number`], [`::number`]],
        [`log10`, [`::negative-float`], { value: NaN }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`sin`, () => {
    test(`samples`, () => {
      expect(lits.run(`(sin 0)`)).toBe(Math.sin(0))
      expect(lits.run(`(sin 0.1)`)).toBe(Math.sin(0.1))
      expect(lits.run(`(sin -0.1)`)).toBe(Math.sin(-0.1))
      expect(lits.run(`(sin 1)`)).toBe(Math.sin(1))
      expect(lits.run(`(sin 100)`)).toBe(Math.sin(100))

      expect(lits.run(`(sin :foo)`)).toBeNaN()

      expect(() => lits.run(`(sin)`)).toThrow()
      expect(() => lits.run(`(sin 1 2)`)).toThrow()
    })
    describe(`sin dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`sin`, [`::string`], { value: NaN }],
        [`sin`, [`::positive-infinity`], { value: NaN }],
        [`sin`, [`::negative-infinity`], { value: NaN }],
        [`sin`, [`::zero`], { value: 0 }],
        [`sin`, [`::unknown`], [`::float`, `::nan`]],
        [`sin`, [`::number-or-nan`], [`::float`, `::nan`]],
        [`sin`, [`::number`], [`::float`, `::nan`]],
        [`sin`, [`::positive-number`], [`::non-zero-float`, `::nan`]],
        [`sin`, [`::float`], [`::float`]],
        [`sin`, [`::positive-float`], [`::non-zero-float`]],
        [`sin`, [`::non-positive-number`], [`::float`, `::nan`]],
        [`sin`, [`::non-negative-number`], [`::float`, `::nan`]],
        [`sin`, [`::negative-float`], [`::non-zero-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`cos`, () => {
    test(`samples`, () => {
      expect(lits.run(`(cos 0)`)).toBe(Math.cos(0))
      expect(lits.run(`(cos 0.1)`)).toBe(Math.cos(0.1))
      expect(lits.run(`(cos -0.1)`)).toBe(Math.cos(-0.1))
      expect(lits.run(`(cos 1)`)).toBe(Math.cos(1))
      expect(lits.run(`(cos 100)`)).toBe(Math.cos(100))

      expect(lits.run(`(cos :foo)`)).toBeNaN()

      expect(() => lits.run(`(cos)`)).toThrow()
      expect(() => lits.run(`(cos 1 2)`)).toThrow()
    })
    describe(`cos dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`cos`, [`::string`], { value: NaN }],
        [`cos`, [`::positive-infinity`], { value: NaN }],
        [`cos`, [`::negative-infinity`], { value: NaN }],
        [`cos`, [`::zero`], { value: 1 }],
        [`cos`, [`::unknown`], [`::non-zero-float`, `::nan`]],
        [`cos`, [`::number-or-nan`], [`::non-zero-float`, `::nan`]],
        [`cos`, [`::number`], [`::non-zero-float`, `::nan`]],
        [`cos`, [`::positive-number`], [`::non-zero-float`, `::nan`]],
        [`cos`, [`::float`], [`::non-zero-float`]],
        [`cos`, [`::positive-float`], [`::non-zero-float`]],
        [`cos`, [`::non-positive-number`], [`::non-zero-float`, `::nan`]],
        [`cos`, [`::non-negative-number`], [`::non-zero-float`, `::nan`]],
        [`cos`, [`::negative-float`], [`::non-zero-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`tan`, () => {
    test(`samples`, () => {
      expect(lits.run(`(tan 0)`)).toBe(Math.tan(0))
      expect(lits.run(`(tan 0.1)`)).toBe(Math.tan(0.1))
      expect(lits.run(`(tan -0.1)`)).toBe(Math.tan(-0.1))
      expect(lits.run(`(tan 1)`)).toBe(Math.tan(1))
      expect(lits.run(`(tan 100)`)).toBe(Math.tan(100))

      expect(lits.run(`(tan :foo)`)).toBeNaN()

      expect(() => lits.run(`(tan)`)).toThrow()
      expect(() => lits.run(`(tan 1 2)`)).toThrow()
    })
    describe(`tan dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`tan`, [`::string`], { value: NaN }],
        [`tan`, [`::positive-infinity`], { value: NaN }],
        [`tan`, [`::negative-infinity`], { value: NaN }],
        [`tan`, [`::zero`], { value: 0 }],
        [`tan`, [`::unknown`], [`::float`, `::nan`]],
        [`tan`, [`::number-or-nan`], [`::float`, `::nan`]],
        [`tan`, [`::number`], [`::float`, `::nan`]],
        [`tan`, [`::positive-number`], [`::non-zero-float`, `::nan`]],
        [`tan`, [`::float`], [`::float`]],
        [`tan`, [`::positive-float`], [`::non-zero-float`]],
        [`tan`, [`::non-positive-number`], [`::float`, `::nan`]],
        [`tan`, [`::non-negative-number`], [`::float`, `::nan`]],
        [`tan`, [`::negative-float`], [`::non-zero-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`sinh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(sinh 0)`)).toBe(Math.sinh(0))
      expect(lits.run(`(sinh 0.1)`)).toBe(Math.sinh(0.1))
      expect(lits.run(`(sinh -0.1)`)).toBe(Math.sinh(-0.1))
      expect(lits.run(`(sinh 1)`)).toBe(Math.sinh(1))
      expect(lits.run(`(sinh 100)`)).toBe(Infinity)

      expect(lits.run(`(sinh :foo)`)).toBeNaN()

      expect(() => lits.run(`(sinh)`)).toThrow()
      expect(() => lits.run(`(sinh 1 2)`)).toThrow()
    })
    describe(`sinh dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`sinh`, [`::string`], { value: NaN }],
        [`sinh`, [`::positive-infinity`], { value: Infinity }],
        [`sinh`, [`::negative-infinity`], { value: -Infinity }],
        [`sinh`, [`::zero`], { value: 0 }],
        [`sinh`, [`::unknown`], [`::number-or-nan`]],
        [`sinh`, [`::number-or-nan`], [`::number-or-nan`]],
        [`sinh`, [`::number`], [`::number`]],
        [`sinh`, [`::positive-number`], [`::positive-number`]],
        [`sinh`, [`::float`], [`::number`]],
        [`sinh`, [`::positive-float`], [`::positive-number`]],
        [`sinh`, [`::non-positive-number`], [`::non-positive-number`]],
        [`sinh`, [`::non-negative-number`], [`::non-negative-number`]],
        [`sinh`, [`::negative-float`], [`::negative-number`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })
  describe(`cosh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(cosh 0)`)).toBe(Math.cosh(0))
      expect(lits.run(`(cosh 0.1)`)).toBe(Math.cosh(0.1))
      expect(lits.run(`(cosh -0.1)`)).toBe(Math.cosh(-0.1))
      expect(lits.run(`(cosh 1)`)).toBe(Math.cosh(1))
      expect(lits.run(`(cosh 100)`)).toBe(Infinity)

      expect(lits.run(`(cosh :foo)`)).toBeNaN()

      expect(() => lits.run(`(cosh)`)).toThrow()
      expect(() => lits.run(`(cosh 1 2)`)).toThrow()
    })
    describe(`cosh dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`cosh`, [`::string`], { value: NaN }],
        [`cosh`, [`::positive-infinity`], { value: Infinity }],
        [`cosh`, [`::negative-infinity`], { value: Infinity }],
        [`cosh`, [`::zero`], { value: 1 }],
        [`cosh`, [`::unknown`], [`::positive-number`, `::nan`]],
        [`cosh`, [`::number-or-nan`], [`::positive-number`, `::nan`]],
        [`cosh`, [`::number`], [`::positive-number`]],
        [`cosh`, [`::positive-number`], [`::positive-number`]],
        [`cosh`, [`::float`], [`::positive-number`]],
        [`cosh`, [`::positive-float`], [`::positive-number`]],
        [`cosh`, [`::non-positive-number`], [`::positive-number`]],
        [`cosh`, [`::non-negative-number`], [`::positive-number`]],
        [`cosh`, [`::negative-float`], [`::positive-number`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`tanh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(tanh 0)`)).toBe(Math.tanh(0))
      expect(lits.run(`(tanh 0.1)`)).toBe(Math.tanh(0.1))
      expect(lits.run(`(tanh -0.1)`)).toBe(Math.tanh(-0.1))
      expect(lits.run(`(tanh 1)`)).toBe(Math.tanh(1))
      expect(lits.run(`(tanh 100)`)).toBe(Math.tanh(100))

      expect(lits.run(`(tanh :foo)`)).toBeNaN()

      expect(() => lits.run(`(tanh)`)).toThrow()
      expect(() => lits.run(`(tanh 1 2)`)).toThrow()
    })
    describe(`tanh dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`tanh`, [`::string`], { value: NaN }],
        [`tanh`, [`::positive-infinity`], { value: 1 }],
        [`tanh`, [`::negative-infinity`], { value: -1 }],
        [`tanh`, [`::zero`], { value: 0 }],
        [`tanh`, [`::unknown`], [`::float`, `::nan`]],
        [`tanh`, [`::number-or-nan`], [`::float`, `::nan`]],
        [`tanh`, [`::number`], [`::float`]],
        [`tanh`, [`::positive-number`], [`::positive-float`]],
        [`tanh`, [`::float`], [`::float`]],
        [`tanh`, [`::positive-float`], [`::positive-float`]],
        [`tanh`, [`::non-positive-number`], [`::non-positive-float`]],
        [`tanh`, [`::non-negative-number`], [`::non-negative-float`]],
        [`tanh`, [`::negative-float`], [`::negative-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`asin`, () => {
    test(`samples`, () => {
      expect(lits.run(`(asin 0)`)).toBe(Math.asin(0))
      expect(lits.run(`(asin 0.1)`)).toBe(Math.asin(0.1))
      expect(lits.run(`(asin -0.1)`)).toBe(Math.asin(-0.1))
      expect(lits.run(`(asin 1)`)).toBe(Math.asin(1))
      expect(lits.run(`(asin 100)`)).toBeNaN()

      expect(lits.run(`(asin :foo)`)).toBeNaN()

      expect(() => lits.run(`(asin)`)).toThrow()
      expect(() => lits.run(`(asin 1 2)`)).toThrow()
    })
    describe(`asin dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`asin`, [`::string`], { value: NaN }],
        [`asin`, [`::positive-infinity`], { value: NaN }],
        [`asin`, [`::negative-infinity`], { value: NaN }],
        [`asin`, [`::zero`], { value: 0 }],
        [`asin`, [`::unknown`], [`::float`, `::nan`]],
        [`asin`, [`::number-or-nan`], [`::float`, `::nan`]],
        [`asin`, [`::number`], [`::float`, `::nan`]],
        [`asin`, [`::positive-number`], [`::positive-float`, `::nan`]],
        [`asin`, [`::float`], [`::float`, `::nan`]],
        [`asin`, [`::positive-float`], [`::positive-float`, `::nan`]],
        [`asin`, [`::non-positive-number`], [`::non-positive-float`, `::nan`]],
        [`asin`, [`::non-negative-number`], [`::non-negative-float`, `::nan`]],
        [`asin`, [`::negative-float`], [`::negative-float`, `::nan`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`acos`, () => {
    test(`samples`, () => {
      expect(lits.run(`(acos 0)`)).toBe(Math.acos(0))
      expect(lits.run(`(acos 0.1)`)).toBe(Math.acos(0.1))
      expect(lits.run(`(acos -0.1)`)).toBe(Math.acos(-0.1))
      expect(lits.run(`(acos 1)`)).toBe(Math.acos(1))
      expect(lits.run(`(acos 100)`)).toBeNaN()

      expect(lits.run(`(acos :foo)`)).toBeNaN()

      expect(() => lits.run(`(acos)`)).toThrow()
      expect(() => lits.run(`(acos 1 2)`)).toThrow()
    })
    describe(`acos dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`acos`, [`::string`], { value: NaN }],
        [`acos`, [`::positive-infinity`], { value: NaN }],
        [`acos`, [`::negative-infinity`], { value: NaN }],
        [`acos`, [`::zero`], [`::positive-float`]],
        [`acos`, [`::unknown`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::number-or-nan`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::number`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::positive-number`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::float`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::positive-float`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::non-positive-number`], [`::positive-float`, `::nan`]],
        [`acos`, [`::non-negative-number`], [`::non-negative-float`, `::nan`]],
        [`acos`, [`::negative-float`], [`::positive-float`, `::nan`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })
  describe(`atan`, () => {
    test(`samples`, () => {
      expect(lits.run(`(atan 0)`)).toBe(Math.atan(0))
      expect(lits.run(`(atan 0.1)`)).toBe(Math.atan(0.1))
      expect(lits.run(`(atan -0.1)`)).toBe(Math.atan(-0.1))
      expect(lits.run(`(atan 1)`)).toBe(Math.atan(1))
      expect(lits.run(`(atan 100)`)).toBe(Math.atan(100))

      expect(lits.run(`(atan :foo)`)).toBeNaN()

      expect(() => lits.run(`(atan)`)).toThrow()
      expect(() => lits.run(`(atan 1 2)`)).toThrow()
    })
    describe(`atan dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`atan`, [`::string`], { value: NaN }],
        [`atan`, [`::positive-infinity`], { value: Math.PI / 2 }],
        [`atan`, [`::negative-infinity`], { value: -Math.PI / 2 }],
        [`atan`, [`::zero`], { value: 0 }],
        [`atan`, [`::unknown`], [`::float`, `::nan`]],
        [`atan`, [`::number-or-nan`], [`::float`, `::nan`]],
        [`atan`, [`::number`], [`::float`]],
        [`atan`, [`::positive-number`], [`::positive-float`]],
        [`atan`, [`::float`], [`::float`]],
        [`atan`, [`::positive-float`], [`::positive-float`]],
        [`atan`, [`::non-positive-number`], [`::non-positive-float`]],
        [`atan`, [`::non-negative-number`], [`::non-negative-float`]],
        [`atan`, [`::negative-float`], [`::negative-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`asinh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(asinh 0)`)).toBe(Math.asinh(0))
      expect(lits.run(`(asinh 0.1)`)).toBe(Math.asinh(0.1))
      expect(lits.run(`(asinh -0.1)`)).toBe(Math.asinh(-0.1))
      expect(lits.run(`(asinh 1)`)).toBe(Math.asinh(1))
      expect(lits.run(`(asinh 100)`)).toBe(Math.asinh(100))

      expect(lits.run(`(asinh :foo)`)).toBeNaN()

      expect(() => lits.run(`(asinh)`)).toThrow()
      expect(() => lits.run(`(asinh 1 2)`)).toThrow()
    })
    describe(`asinh dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`asinh`, [`::string`], { value: NaN }],
        [`asinh`, [`::positive-infinity`], { value: Infinity }],
        [`asinh`, [`::negative-infinity`], { value: -Infinity }],
        [`asinh`, [`::zero`], { value: 0 }],
        [`asinh`, [`::unknown`], [`::number-or-nan`]],
        [`asinh`, [`::number-or-nan`], [`::number-or-nan`]],
        [`asinh`, [`::number`], [`::number`]],
        [`asinh`, [`::positive-number`], [`::positive-number`]],
        [`asinh`, [`::positive-integer`], [`::positive-float`]],
        [`asinh`, [`::negative-number`], [`::negative-number`]],
        [`asinh`, [`::negative-integer`], [`::negative-float`]],
        [`asinh`, [`::float`], [`::float`]],
        [`asinh`, [`::positive-float`], [`::positive-float`]],
        [`asinh`, [`::non-positive-number`], [`::non-positive-number`]],
        [`asinh`, [`::non-negative-number`], [`::non-negative-number`]],
        [`asinh`, [`::negative-float`], [`::negative-float`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })
  describe(`acosh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(acosh 1)`)).toBe(Math.acosh(1))
      expect(lits.run(`(acosh 100)`)).toBe(Math.acosh(100))
      expect(lits.run(`(acosh 0.1)`)).toBeNaN()
      expect(lits.run(`(acosh -0.1)`)).toBeNaN()
      expect(lits.run(`(acosh 0)`)).toBeNaN()

      expect(lits.run(`(acosh :foo)`)).toBeNaN()

      expect(() => lits.run(`(acosh)`)).toThrow()
      expect(() => lits.run(`(acosh 1 2)`)).toThrow()
    })
    describe(`acosh dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`acosh`, [`::string`], { value: NaN }],
        [`acosh`, [`::positive-infinity`], { value: Infinity }],
        [`acosh`, [`::negative-infinity`], { value: NaN }],
        [`acosh`, [`::zero`], { value: NaN }],
        [`acosh`, [`::unknown`], [`::non-negative-number`, `::nan`]],
        [`acosh`, [`::number-or-nan`], [`::non-negative-number`, `::nan`]],
        [`acosh`, [`::number`], [`::non-negative-number`, `::nan`]],
        [`acosh`, [`::positive-number`], [`::non-negative-number`, `::nan`]],
        [`acosh`, [`::positive-integer`], [`::non-negative-float`]],
        [`acosh`, [`::negative-number`], { value: NaN }],
        [`acosh`, [`::negative-integer`], { value: NaN }],
        [`acosh`, [`::float`], [`::non-negative-float`, `::nan`]],
        [`acosh`, [`::positive-float`], [`::non-negative-float`, `::nan`]],
        [`acosh`, [`::non-positive-number`], { value: NaN }],
        [`acosh`, [`::non-negative-number`], [`::non-negative-number`, `::nan`]],
        [`acosh`, [`::negative-float`], { value: NaN }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })
  describe(`atanh`, () => {
    test(`samples`, () => {
      expect(lits.run(`(atanh 0)`)).toBe(Math.atanh(0))
      expect(lits.run(`(atanh 0.1)`)).toBe(Math.atanh(0.1))
      expect(lits.run(`(atanh -0.1)`)).toBe(Math.atanh(-0.1))
      expect(lits.run(`(atanh 1)`)).toBe(Infinity)
      expect(lits.run(`(atanh 100)`)).toBeNaN()

      expect(lits.run(`(atanh :foo)`)).toBeNaN()

      expect(() => lits.run(`(atanh)`)).toThrow()
      expect(() => lits.run(`(atanh 1 2)`)).toThrow()
    })
    describe(`atanh dataTypes`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`atanh`, [`::string`], { value: NaN }],
        [`atanh`, [`::positive-infinity`], { value: NaN }],
        [`atanh`, [`::negative-infinity`], { value: NaN }],
        [`atanh`, [`::zero`], { value: 0 }],
        [`atanh`, [`::unknown`], [`::number-or-nan`]],
        [`atanh`, [`::number-or-nan`], [`::number-or-nan`]],
        [`atanh`, [`::number`], [`::number-or-nan`]],
        [`atanh`, [`::positive-number`], [`::positive-number`, `::nan`]],
        [`atanh`, [`::positive-integer`], [`::positive-infinity`, `::nan`]],
        [`atanh`, [`::negative-number`], [`::negative-number`, `::nan`]],
        [`atanh`, [`::negative-integer`], [`::negative-infinity`, `::nan`]],
        [`atanh`, [`::float`], [`::number-or-nan`]],
        [`atanh`, [`::positive-float`], [`::positive-number`, `::nan`]],
        [`atanh`, [`::non-positive-number`], [`::non-positive-number`, `::nan`]],
        [`atanh`, [`::non-negative-number`], [`::non-negative-number`, `::nan`]],
        [`atanh`, [`::negative-float`], [`::negative-number`, `::nan`]],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`quot`, () => {
    test(`samples`, () => {
      expect(lits.run(`(quot 13.75 3.25)`)).toBe(4)
      expect(lits.run(`(quot -13.75 3.25)`)).toBe(-4)
      expect(lits.run(`(quot 13.75 -3.25)`)).toBe(-4)
      expect(lits.run(`(quot -13.75 -3.25)`)).toBe(4)

      expect(lits.run(`(quot :foo -3.25)`)).toBeNaN()
      expect(lits.run(`(quot -13.75 :foo)`)).toBeNaN()

      expect(() => lits.run(`(quot)`)).toThrow()
      expect(() => lits.run(`(quot 1)`)).toThrow()
      expect(() => lits.run(`(quot 1 2 3)`)).toThrow()
    })

    describe(`quot dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`quot`, [`::unknown`, `::unknown`], [`::integer`, `::illegal-number`]],
        [`quot`, [`::unknown`, `::integer`], [`::integer`, `::illegal-number`]],
        [`quot`, [`::integer`, `::unknown`], [`::integer`, `::illegal-number`]],
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
        [`quot`, [`::positive-float`, `::zero`], { value: Infinity }],
        [`quot`, [`::negative-float`, `::zero`], { value: -Infinity }],
        [`quot`, [`::zero`, `::zero`], { value: NaN }],
      ]
      testTypeEvaluations(lits, typeEvaluations)
    })
  })

  describe(`mod.`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(mod)`)).toThrow()
      expect(() => lits.run(`(mod 1)`)).toThrow()
      expect(() => lits.run(`(mod 3)`)).toThrow()
      expect(() => lits.run(`(mod 3 4 5)`)).toThrow()

      expect(lits.run(`(mod (infinity) 1)`)).toBeNaN()
      expect(lits.run(`(mod (- (infinity)) 1)`)).toBeNaN()
      expect(lits.run(`(mod (nan) 1)`)).toBeNaN()
      expect(lits.run(`(mod 12.2 (infinity))`)).toBe(12.2)
      expect(lits.run(`(mod -12.1 (- (infinity)))`)).toBe(-12.1)
      expect(lits.run(`(mod 12.2 1000)`)).toBe(12.2)
      expect(lits.run(`(mod -12.1 -1000)`)).toBe(-12.1)
      expect(lits.run(`(mod 12 (nan))`)).toBeNaN()

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
        [`mod`, [`::unknown`, `::unknown`], [`::float`, `::nan`]],
        [`mod`, [`::positive-infinity`, `::positive-integer`], { value: NaN }],

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

      expect(lits.run(`(rem (infinity) 1)`)).toBeNaN()
      expect(lits.run(`(rem (- (infinity)) 1)`)).toBeNaN()
      expect(lits.run(`(rem (nan) 1)`)).toBeNaN()
      expect(lits.run(`(rem 12.2 (infinity))`)).toBe(12.2)
      expect(lits.run(`(rem -12.1 (- (infinity)))`)).toBe(-12.1)
      expect(lits.run(`(rem 12.2 1000)`)).toBe(12.2)
      expect(lits.run(`(rem -12.1 -1000)`)).toBe(-12.1)
      expect(lits.run(`(rem 12 (nan))`)).toBeNaN()

      expect(() => lits.run(`(rem)`)).toThrow()
      expect(() => lits.run(`(rem 1)`)).toThrow()
      expect(() => lits.run(`(rem 1 2 3)`)).toThrow()
    })
    describe(`rem dataTypes.`, () => {
      const typeEvaluations: TestTypeEvaluation[] = [
        [`rem`, [`::unknown`, `::unknown`], [`::float`, `::nan`]],
        [`rem`, [`::positive-infinity`, `::positive-integer`], { value: NaN }],
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
