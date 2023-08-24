import { testTypeGuars } from '../../__tests__/testUtils'
import { AstNodeType, TokenType } from '../constants/constants'
import type { Seq } from '../interface'
import type { AstNode, RegularExpression } from '../parser/interface'
import { FUNCTION_SYMBOL, REGEXP_SYMBOL } from '../utils/symbols'
import {
  asAny,
  assertAny,
  assertObj,
  assertRegularExpression,
  assertSeq,
  assertStringOrRegularExpression,
  isRegularExpression,
  asColl,
  isAny,
  isObj,
  asObj,
  asRegularExpression,
  isSeq,
  asSeq,
  isStringOrRegularExpression,
  asStringOrRegularExpression,
  isColl,
  assertColl,
} from './lits'

describe(`lits type guards`, () => {
  test(`Any`, () => {
    const node: AstNode = {
      t: AstNodeType.Name,
      v: `test`,
      tkn: { t: TokenType.Name, v: `X` },
    }

    const valid = [node, 1, `bar`, null, [], {}]
    const invalid = [undefined]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isAny, as: asAny, assert: assertAny },
    )
  })

  test(`Obj`, () => {
    const valid = [{}, { a: 1 }]
    const invalid = [0, { [FUNCTION_SYMBOL]: true }, /test/, [], [1], true, null, undefined]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isObj, as: asObj, assert: assertObj },
    )
  })

  test(`RegularExpression`, () => {
    const regExp: RegularExpression = {
      [REGEXP_SYMBOL]: true,
      s: `^ab`,
      f: ``,
    }
    const invalid = [/a/, new RegExp(`a`), 0, `0`, null, undefined, false, true, [], {}]
    testTypeGuars(
      {
        valid: [regExp],
        invalid,
      },
      { is: isRegularExpression, as: asRegularExpression, assert: assertRegularExpression },
    )
  })

  test(`Seq`, () => {
    const valid: Seq = [``, `1`, [], [1, 2, 3]]
    const invalid = [0, 1, true, false, null, undefined, {}]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isSeq, as: asSeq, assert: assertSeq },
    )
  })

  test(`stringOrRegularExpression`, () => {
    const regExp: RegularExpression = {
      [REGEXP_SYMBOL]: true,
      s: `^ab`,
      f: ``,
    }
    const valid = [``, `1`, regExp]
    const invalid = [/^a/, [], [1, 2, 3], 0, 1, true, false, null, undefined, {}]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isStringOrRegularExpression, as: asStringOrRegularExpression, assert: assertStringOrRegularExpression },
    )
  })

  test(`Coll`, () => {
    const valid = [`2`, { a: 1 }, [2]]
    const invalid = [0, null, true, false]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isColl, as: asColl, assert: assertColl },
    )
  })
})
