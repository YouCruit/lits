/* istanbul ignore file */

import { PrimitiveTypeName, typeToBitRecord } from '../src/analyze/dataTypes/DataType'
import { TypeName } from '../src/analyze/dataTypes/litsTypeNames'
import { UndefinedSymbolEntry } from '../src/analyze/undefinedSymbols/interface'
import { Obj } from '../src/interface'
import { DataType, Lits } from '../src/Lits/Lits'
import { asValue, dataType, regularExpression } from '../src/utils/assertion'

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
  const sortedUdrFlags = udr.flags.split(``).sort().join(``)
  const sortedRFlags = r.flags.split(``).sort().join(``)
  return udr.source === r.source && sortedRFlags === sortedUdrFlags
}

export function getUndefinedSymbolNames(undefinedSymbols: Set<UndefinedSymbolEntry>): Set<string> {
  const names = [...undefinedSymbols].map(entry => entry.symbol)
  return new Set<string>(names)
}

export type TestTypeEvaluation = [
  string,
  Array<`::${TypeName}` | Array<`::${TypeName}`> | { expression: string }>,
  `::${TypeName}` | Array<`::${TypeName}`> | { expression: string } | `ERROR`,
]

/**
 * @param paramOrder
 *  commutativeParams: order of params does not matter, test all combinations
 *  commutativeRestParams: order of rest-params does not matter, test all combinations (rest-params = all but the first param)
 *
 */
export function testTypeEvaluations(
  lits: Lits,
  evaluations: TestTypeEvaluation[],
  paramOrder?: `commutativeParams` | `commutativeRestParams`,
) {
  for (const evaluationData of evaluations) {
    const [functionName, params, result] = evaluationData
    const resultExpression =
      typeof result === `string` ? result : Array.isArray(result) ? `(type-or ${result.join(` `)})` : result.expression

    const expressions = generateLitsExpressions(functionName, params, paramOrder)
    const sampleExpressions = generateLitsExpressionsWithSampleValues(lits, functionName, params, paramOrder)
    test(`${expressions[0]} ==> ${resultExpression}${
      expressions.length > 1 ? `, ${expressions.length} permutations` : ``
    }`, () => {
      for (const expression of expressions) {
        if (resultExpression !== `ERROR`) {
          const type = lits.run(expression) as DataType
          const expectedType = lits.run(resultExpression) as DataType
          expect(type.toString()).toBe(expectedType.toString())
        } else {
          expect(() => lits.run(expression)).toThrow()
        }
      }

      for (const expression of sampleExpressions) {
        if (resultExpression !== `ERROR`) {
          const testString = `(type-is? (type-of ${expression}) (type-of ${resultExpression}))`
          if (!lits.run(testString)) {
            throw Error(`Expected ${testString} to be true`)
          }
        } else {
          expect(() => lits.run(expression)).toThrow()
        }
      }

      const resultType = lits.run(`(type-of ${resultExpression})`) as DataType
      const combinedSampeExpressionType = DataType.or(
        ...sampleExpressions.map(e => lits.run(`(type-of ${e})`) as DataType),
      )
      if (!combinedSampeExpressionType.equals(resultType)) {
        throw Error(
          `Expected combined sample type (${combinedSampeExpressionType.toString({
            showDetails: false,
          })}) to equal result type (${resultType.toString({
            showDetails: false,
          })}) - ${JSON.stringify(sampleExpressions, null, 2)}`,
        )
      }
    })
  }
}

function generateLitsExpressions(
  functionName: string,
  params: Array<`::${TypeName}` | Array<`::${TypeName}`> | { expression: string }>,
  paramOrder?: `commutativeParams` | `commutativeRestParams`,
): string[] {
  const litsTypeParams = params.map(p =>
    typeof p === `string` ? p : Array.isArray(p) ? `(type-or ${p.join(` `)})` : p.expression,
  )
  switch (paramOrder) {
    // All combinations of the ordering of the params will be tested
    case `commutativeParams`:
      return combinations(litsTypeParams).map(params => getLitsExpression(functionName, params))

    // All combinations of the ordering of the rest-params will be tested.
    // rest-params = all but the first param
    case `commutativeRestParams`:
      if (litsTypeParams.length <= 2) {
        return [getLitsExpression(functionName, litsTypeParams)]
      } else {
        const firstParam = asValue(litsTypeParams[0])
        return combinations(litsTypeParams.slice(1)).map(params =>
          getLitsExpression(functionName, [firstParam, ...params]),
        )
      }

    default:
      return [getLitsExpression(functionName, litsTypeParams)]
  }
}

function generateLitsExpressionsWithSampleValues(
  lits: Lits,
  functionName: string,
  params: Array<`::${TypeName}` | Array<`::${TypeName}`> | { expression: string }>,
  paramOrder?: `commutativeParams` | `commutativeRestParams`,
): string[] {
  const litsTypeParams = params.map(p =>
    typeof p === `string` ? p : Array.isArray(p) ? `(type-or ${p.join(` `)})` : p.expression,
  )
  switch (paramOrder) {
    // All combinations of the ordering of the params will be tested
    case `commutativeParams`:
      return combinations(litsTypeParams).flatMap(paramsCombination =>
        getSampleExpressions(lits, functionName, paramsCombination),
      )

    // All combinations of the ordering of the rest-params will be tested.
    // rest-params = all but the first param
    case `commutativeRestParams`:
      if (litsTypeParams.length <= 2) {
        return [getLitsExpression(functionName, litsTypeParams)]
      } else {
        const firstParam = asValue(litsTypeParams[0])
        return combinations(litsTypeParams.slice(1)).flatMap(restParamsCombination => {
          const params = [firstParam, ...restParamsCombination]
          return getSampleExpressions(lits, functionName, params)
        })
      }

    default:
      return getSampleExpressions(lits, functionName, litsTypeParams)
  }
}

export function getSampleExpressions(lits: Lits, functionName: string, litsTypeParams: string[]): string[] {
  // Each param will be substituted with an array of sample values based on the type
  const litsTypeParamsVariants = litsTypeParams.map(param => {
    const type = dataType.as(lits.run(`(type-of ${param})`))
    return getSampleValuesForType(type)
  })

  const sampleParamsCombinations = getParamCombinations(litsTypeParamsVariants)

  return sampleParamsCombinations.map(finalParams => getLitsExpression(functionName, finalParams))
}

/**
 * Create permutations of sample value params
 *
 * @param litsTypeParamsVariants
 *  E.g. [[42, 0] ["foo"] [true, false]]
 *  First param can be 42 or 0, Second param can only be "foo" and third param can be true or false
 * @returns
 *  E.g. [[42, "foo", true], [0, "foo", true], [42, "foo", false], [0, "foo", false]]
 */
export function getParamCombinations(litsTypeParamsVariants: string[][]): string[][] {
  // E.g. [2, 1, 2]
  const dimensions = litsTypeParamsVariants.map(x => x.length)

  // E.g. 4 (2 * 1 * 2)
  const size = litsTypeParamsVariants.reduce((result, variants) => result * variants.length, 1)

  const result: string[][] = []
  for (let variantIndex = 0; variantIndex < size; variantIndex += 1) {
    const params: string[] = []
    let x = variantIndex
    let divider = 1
    dimensions.forEach((dimension, paramIndex) => {
      params.push(asValue(asValue(litsTypeParamsVariants[paramIndex])[x % dimension]))
      divider *= dimension
      x = Math.floor(variantIndex / divider)
    })
    result.push(params)
  }
  return result
}

function getLitsExpression(functionName: string, params: string[]) {
  return `(${functionName} ${params.join(` `)})`
}

/**
 * Recursive function for calculating permutations
 *
 * @param litsTypeParams
 *  E.g. ["::boolean", "::string", "::number"]
 * @returns
 *  E.g. [
 *        ["::boolean", "::string", "::number"],
 *        ["::boolean", "::number", "::string"],
 *        ["::string", "::boolean", "::number"],
 *        ["::string", "::number", "::boolean"],
 *        ["::number", "::boolean", "::string"],
 *        ["::number", "::string", "::boolean"]
 *      ]
 */
export function combinations(litsTypeParams: string[]): string[][] {
  const result: string[][] = []
  if (litsTypeParams.length === 0) {
    return []
  }
  if (litsTypeParams.length === 1) {
    return [[asValue(litsTypeParams[0])]]
  }
  if (litsTypeParams.length === 2) {
    return [
      [asValue(litsTypeParams[0]), asValue(litsTypeParams[1])],
      [asValue(litsTypeParams[1]), asValue(litsTypeParams[0])],
    ]
  }

  for (let index = 0; index < litsTypeParams.length; index += 1) {
    for (const combination of combinations([...litsTypeParams.slice(0, index), ...litsTypeParams.slice(index + 1)])) {
      const pickedValue = asValue(litsTypeParams[index])
      result.push([pickedValue, ...combination])
    }
  }
  return result
}

const bitsToSambleValue = Object.entries(typeToBitRecord).reduce((result: Record<string, string[]>, entry) => {
  result[entry[1]] = getSampleValueFromPrimitiveTypeName(entry[0] as PrimitiveTypeName)
  return result
}, {})

function getSampleValueFromPrimitiveTypeName(name: PrimitiveTypeName): string[] {
  switch (name) {
    case `nil`:
      return [`nil`]
    case `empty-string`:
      return [`""`]
    case `zero`:
      return [`0`]
    case `false`:
      return [`false`]
    case `nan`:
      return [`(nan)`]
    case `positive-infinity`:
      return [`(positive-infinity)`]
    case `negative-infinity`:
      return [`(negative-infinity)`]
    case `true`:
      return [`true`]
    case `non-empty-string`:
      return [`:Albert`]
    case `regexp`:
      return [`#"^s*(.*)$"`]
    case `positive-integer`:
      return [`1`, `42`]
    case `negative-integer`:
      return [`-1`, `-42`]
    case `positive-non-integer`:
      return [`0.5`, `1.5`, `(pi)`, `(e)`]
    case `negative-non-integer`:
      return [`-0.5`, `-1.5`, `(- (pi))`, `(- (e))`]
    case `empty-array`:
      return [`[]`]
    case `non-empty-array`:
      return [`[1 2 3]`]
    case `empty-object`:
      return [`{}`]
    case `non-empty-object`:
      return [`{ :foo :bar }`]
    case `function`:
      return [`#(+ %1 %2)`]
  }
}

export function getSampleValuesForType(dataType: DataType): string[] {
  return dataType.toPrimitiveTypes().flatMap(type => asValue(bitsToSambleValue[type.bitmask]))
}
