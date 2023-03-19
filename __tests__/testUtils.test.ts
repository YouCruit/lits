/* istanbul ignore file */

import { DataType, Lits } from '../src/Lits/Lits'
import { combinations, getParamCombinations, getSampleExpressions, getSampleValuesForType } from './testUtils'

describe(`testUtils`, () => {
  test(`combinations`, () => {
    expect(combinations([])).toEqual([])
    expect(combinations([`X`])).toEqual([[`X`]])
    expect(combinations([`X`, `Y`])).toEqual([
      [`X`, `Y`],
      [`Y`, `X`],
    ])
    expect(combinations([`X`, `Y`, `Z`])).toEqual([
      [`X`, `Y`, `Z`],
      [`X`, `Z`, `Y`],
      [`Y`, `X`, `Z`],
      [`Y`, `Z`, `X`],
      [`Z`, `X`, `Y`],
      [`Z`, `Y`, `X`],
    ])
    expect(combinations([`X`, `Y`, `Z`, `foo`]).length).toBe(24)
  })
  test(`getSampleValuesForType`, () => {
    expect(getSampleValuesForType(DataType.array)).toEqual([`[]`, `[1 2 3]`])
    expect(getSampleValuesForType(DataType.unknown)).toEqual([
      `nil`,
      `""`,
      `0`,
      `false`,
      `(nan)`,
      `(positive-infinity)`,
      `(negative-infinity)`,
      `true`,
      `:Albert`,
      `#"^s*(.*)$"`,
      `42`,
      `-1`,
      `3.14`,
      `-0.5`,
      `[]`,
      `[1 2 3]`,
      `{}`,
      `{ :foo :bar }`,
      `#(+ %1 %2)`,
    ])
  })

  test(`getParamCombinations`, () => {
    expect(
      getParamCombinations([
        [`A`, `B`],
        [`X`, `Y`],
        [`1`, `2`, `3`],
      ]),
    ).toEqual([
      [`A`, `X`, `1`],
      [`B`, `X`, `1`],
      [`A`, `Y`, `1`],
      [`B`, `Y`, `1`],
      [`A`, `X`, `2`],
      [`B`, `X`, `2`],
      [`A`, `Y`, `2`],
      [`B`, `Y`, `2`],
      [`A`, `X`, `3`],
      [`B`, `X`, `3`],
      [`A`, `Y`, `3`],
      [`B`, `Y`, `3`],
    ])
  })
  test(`getSampleExpressions`, () => {
    const lits = new Lits()
    expect(getSampleExpressions(lits, `+`, [`::number`])).toEqual([`(+ 0)`, `(+ 42)`, `(+ -1)`, `(+ 3.14)`, `(+ -0.5)`])
  })
})
