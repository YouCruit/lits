/* istanbul ignore file */

import { Context, Lits, LitsFunction, LitsParams, isLitsFunction } from '../src'
import { AnalyzeResult } from '../src/analyze/interface'
import { LitsError } from '../src/errors'
import { ContextStack } from '../src/evaluator/ContextStack'
import { Obj } from '../src/interface'
import { regularExpression } from '../src/utils/assertion'

interface Primitives extends Obj {
  string: string
  emptyString: ``
  integer: number
  float: number
  negativeNumber: number
  negativeFloat: number
  zero: 0
  null: null
  boolean: boolean
  true: true
  false: false
}

export interface TestData extends Primitives {
  simpleObject: Primitives
  stringArray: string[]
  numberArray: number[]
  nestedArray: unknown[]
  mixedArray: unknown[]
  emptyArray: []
  emptyObject: Record<string, unknown>
}

const privateTestData: TestData = {
  boolean: true,
  emptyString: ``,
  false: false,
  float: 42.42,
  integer: 42,
  mixedArray: [true, 0, `Albert`, null, ``, 42, -42.42],
  negativeFloat: -42.42,
  negativeNumber: -42,
  null: null,
  numberArray: [0, 1, 2, 3, 4, 5],
  simpleObject: {
    boolean: true,
    emptyString: ``,
    false: false,
    float: 42.42,
    integer: 42,
    negativeFloat: -42.42,
    negativeNumber: -42,
    null: null,
    string: `Albert`,
    true: true,
    zero: 0,
  },
  string: `Albert`,
  stringArray: [`Albert`, `Mojir`, `Lits`, `Immutable`],
  true: true,
  zero: 0,
  emptyArray: [],
  nestedArray: [2, [3, 4], 5],
  emptyObject: {},
}

let testData: TestData

export function createTestData(): TestData {
  testData = JSON.parse(JSON.stringify(privateTestData))
  return testData
}

export function checkTestData(): void {
  const stringifiedTestData = JSON.stringify(testData, null, 4)
  const stringifiedPrivateTestData = JSON.stringify(privateTestData, null, 4)
  if (stringifiedTestData !== stringifiedPrivateTestData) {
    throw Error(`Expected testData to not change got:\n${stringifiedTestData}\nExpected${stringifiedPrivateTestData}`)
  }
}

export function regexpEquals(udr: unknown, r: RegExp): boolean {
  if (!regularExpression.is(udr)) {
    return false
  }
  const sortedUdrFlags = udr.f.split(``).sort().join(``)
  const sortedRFlags = r.flags.split(``).sort().join(``)
  return udr.s === r.source && sortedRFlags === sortedUdrFlags
}

export function getUndefinedSymbolNames(result: AnalyzeResult): Set<string> {
  const names = [...result.undefinedSymbols].map(entry => entry.symbol)
  return new Set<string>(names)
}

export function getLitsVariants() {
  const variants = [new Lits(), new Lits({ debug: true })]
  return {
    run(program: string, LitsParams?: LitsParams): unknown {
      const [result1, result2] = variants.map(l => l.run(program, LitsParams))
      if (isLitsFunction(result1)) {
        expect(isLitsFunction(result2)).toBe(true)
        expect((result2 as LitsFunction).t).toBe(result1.t)
        return result1
      }
      if (result1 instanceof Error) {
        expect(result2).toBeInstanceOf(Error)
        expect((result2 as LitsError).name).toBe(result1.name)
        return result1
      }
      expect(result1).toStrictEqual(result2)
      return result1
    },
    analyze(program: string): AnalyzeResult {
      const results = variants.map(l => l.analyze(program))
      const result1 = results[0] as AnalyzeResult
      const result2 = results[1] as AnalyzeResult
      const us1 = getUndefinedSymbolNames(result1)
      const us2 = getUndefinedSymbolNames(result2)
      expect(us1).toStrictEqual(us2)
      return result1 as AnalyzeResult
    },
  }
}

export function createContextStackWithGlobalContext(context: Context) {
  return new ContextStack({ contexts: [context] })
}
