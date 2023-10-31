import { testTypeGuars } from '../../__tests__/testUtils'
import { FunctionType } from '../constants/constants'
import type { LitsFunction } from '../parser/interface'
import { createNativeJsFunction } from '../utils'
import { FUNCTION_SYMBOL } from '../utils/symbols'

import {
  asLitsFunction,
  assertLitsFunction,
  isLitsFunction,
  isUserDefinedFunction,
  asUserDefinedFunction,
  assertUserDefinedFunction,
  isNativeJsFunction,
  asNativeJsFunction,
  assertNativeJsFunction,
} from './litsFunction'

describe(`litsFunction type guards`, () => {
  const lf1: LitsFunction = {
    [FUNCTION_SYMBOL]: true,
    d: `EOF`,
    t: FunctionType.UserDefined,
    n: undefined,
    o: [
      {
        as: {
          mandatoryArguments: [],
        },
        f: {},
        b: [],
        a: 0,
      },
    ],
  }
  const lf2: LitsFunction = {
    [FUNCTION_SYMBOL]: true,
    d: `EOF`,
    t: FunctionType.Builtin,
    n: `+`,
  }
  const lf3: LitsFunction = {
    [FUNCTION_SYMBOL]: true,
    d: `EOF`,
    t: FunctionType.Partial,
    f: { a: 10, b: 20 },
    p: [],
  }
  const lf4: LitsFunction = {
    [FUNCTION_SYMBOL]: true,
    d: `EOF`,
    t: FunctionType.Comp,
    f: [`x`],
  }
  const lf5: LitsFunction = {
    [FUNCTION_SYMBOL]: true,
    d: `EOF`,
    t: FunctionType.Constantly,
    v: 10,
  }
  const lf6 = createNativeJsFunction(() => undefined)
  const lf7 = createNativeJsFunction(() => undefined, `native`)

  test(`isLitsFunction`, () => {
    const valid = [lf1, lf2, lf3, lf4, lf5, lf6, lf7]
    const invalid = [``, `1`, 0, 1, true, false, null, undefined, [], {}]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isLitsFunction, as: asLitsFunction, assert: assertLitsFunction },
    )
  })

  test(`isUserDefinedFunction`, () => {
    const valid = [lf1]
    const invalid = [lf2, lf3, lf4, lf5, lf6, lf7, ``, `1`, 0, 1, true, false, null, undefined, [], {}]

    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isUserDefinedFunction, as: asUserDefinedFunction, assert: assertUserDefinedFunction },
    )
  })

  test(`isNativeJsFunction`, () => {
    const valid = [lf6, lf7]
    const invalid = [lf1, lf2, lf3, lf4, lf5, ``, `1`, 0, 1, true, false, null, undefined, [], {}]

    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isNativeJsFunction, as: asNativeJsFunction, assert: assertNativeJsFunction },
    )
  })
})
