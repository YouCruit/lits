import { isLitsFunction } from '..'
import { AstNodeType, FunctionType, TokenType } from '../constants/constants'
import type { AstNode, LitsFunction, NameNode, NormalExpressionNode, RegularExpression } from '../parser/interface'
import type { DebugInfo, Token } from '../tokenizer/interface'
import { asNameNode, assertNameNode, isNormalExpressionNodeWithName, isAstNode, isExpressionNode } from './astNode'
import { asLitsFunction, assertLitsFunction } from './function'
import { FUNCTION_SYMBOL, REGEXP_SYMBOL } from '../utils/symbols'
import { assertToken, isToken } from './token'
import { asNonUndefined, assertNonUndefined, assertEventNumberOfParams } from '.'
import {
  asAny,
  assertAny,
  assertObj,
  assertRegularExpression,
  assertSeq,
  assertStringOrRegularExpression,
  isRegularExpression,
  asColl,
} from './lits'
import { assertNumber, asNumber, isNumber } from './number'
import { asString, assertString } from './string'
import { assertNumberOfParams } from '../utils'

const debugInfo: DebugInfo = `EOF`
describe(`utils`, () => {
  test(`asAny`, () => {
    expect(() => asAny(undefined, debugInfo)).toThrow()
    const node: AstNode = {
      t: AstNodeType.Name,
      v: `test`,
      tkn: { t: TokenType.Name, v: `X` },
    }

    expect(asAny(node, debugInfo)).toBe(node)
  })
  test(`assertAny`, () => {
    expect(() => assertAny(undefined, debugInfo)).toThrow()
    const node: AstNode = {
      t: AstNodeType.Name,
      v: `test`,
      tkn: { t: TokenType.Name, v: `X` },
    }

    expect(() => assertAny(node, debugInfo)).not.toThrow()
  })
  test(`assertAny`, () => {
    expect(() => assertAny(undefined, debugInfo)).toThrow()
    const node: AstNode = {
      t: AstNodeType.Name,
      v: `test`,
      tkn: { t: TokenType.Name, v: `X` },
    }

    expect(() => assertAny(node, debugInfo)).not.toThrow()
  })
  test(`asLitsFunction`, () => {
    expect(() => asLitsFunction(undefined, debugInfo)).toThrow()
    const lf: LitsFunction = {
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
    expect(asLitsFunction(lf, debugInfo)).toBe(lf)
  })
  test(`asNameNode`, () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => asNameNode(undefined, {} as any)).toThrow()
    expect(() =>
      asNameNode({
        t: AstNodeType.Number,
        v: 12,
        token: { t: TokenType.Name, v: `X` },
      }),
    ).toThrow()
    const node: NameNode = {
      t: AstNodeType.Name,
      v: `a-name`,
      tkn: { t: TokenType.Name, v: `X` },
    }
    expect(asNameNode(node, node.tkn?.d)).toBe(node)
  })
  test(`assertNameNode`, () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => assertNameNode(undefined, {} as any)).toThrow()
    const node: NameNode = {
      t: AstNodeType.Name,
      v: `a-name`,
      tkn: { t: TokenType.Name, v: `X` },
    }
    asNameNode(node, node.tkn?.d)
  })
  test(`asNotUndefined`, () => {
    expect(() => asNonUndefined(undefined, `EOF`)).toThrow()
    expect(asNonUndefined(null, `EOF`)).toBe(null)
    expect(asNonUndefined(false, `EOF`)).toBe(false)
    expect(asNonUndefined(true, `EOF`)).toBe(true)
    expect(asNonUndefined(0, `EOF`)).toBe(0)
    const obj = {}
    expect(asNonUndefined(obj, `EOF`)).toBe(obj)
  })
  test(`assertNotUndefined`, () => {
    expect(() => assertNonUndefined(undefined, `EOF`)).toThrow()
    expect(() => assertNonUndefined(undefined, `EOF`)).toThrow()
    expect(() => assertNonUndefined(null, `EOF`)).not.toThrow()
    expect(() => assertNonUndefined(false, `EOF`)).not.toThrow()
    expect(() => assertNonUndefined(true, `EOF`)).not.toThrow()
    expect(() => assertNonUndefined(0, `EOF`)).not.toThrow()
    expect(() => assertNonUndefined({}, `EOF`)).not.toThrow()
  })
  test(`asNonEmptyString`, () => {
    expect(asString(`1`, debugInfo, { nonEmpty: true })).toBe(`1`)
    expect(() => asString(``, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString(0, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString(1, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString(true, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString(false, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString(null, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString(undefined, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString([], debugInfo, { nonEmpty: true })).toThrow()
    expect(() => asString({}, debugInfo, { nonEmpty: true })).toThrow()
  })

  test(`assertObj`, () => {
    expect(() => assertObj(0, debugInfo)).toThrow()
    expect(() => assertObj({}, debugInfo)).not.toThrow()
    expect(() => assertObj({ [FUNCTION_SYMBOL]: true }, debugInfo)).toThrow()
    expect(() => assertObj({ a: 1 }, debugInfo)).not.toThrow()
    expect(() => assertObj(/test/, debugInfo)).toThrow()
    expect(() => assertObj([], debugInfo)).toThrow()
    expect(() => assertObj([1], debugInfo)).toThrow()
    expect(() => assertObj(true, debugInfo)).toThrow()
    expect(() => assertObj(null, debugInfo)).toThrow()
    expect(() => assertObj(undefined, debugInfo)).toThrow()
  })
  test(`assertInteger`, () => {
    expect(() => assertNumber(-0, debugInfo, { integer: true })).not.toThrow()
    expect(() => assertNumber(-1, debugInfo, { integer: true })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { integer: true })).not.toThrow()
    expect(() => assertNumber(-0.1, debugInfo, { integer: true })).toThrow()
    expect(() => assertNumber(1.00001, debugInfo, { integer: true })).toThrow()
    expect(() => assertNumber(`k`, debugInfo, { integer: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { integer: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { integer: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { integer: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { integer: true })).toThrow()
  })
  test(`assertRegExp`, () => {
    const a: RegularExpression = {
      [REGEXP_SYMBOL]: true,
      s: `^ab`,
      f: ``,
    }
    expect(() => assertRegularExpression(/a/, debugInfo)).toThrow()
    expect(() => assertRegularExpression(a, debugInfo)).not.toThrow()
    expect(() => assertRegularExpression(new RegExp(`a`), debugInfo)).toThrow()
    expect(() => assertRegularExpression(0, debugInfo)).toThrow()
    expect(() => assertRegularExpression(`0`, debugInfo)).toThrow()
    expect(() => assertRegularExpression(null, debugInfo)).toThrow()
    expect(() => assertRegularExpression(undefined, debugInfo)).toThrow()
    expect(() => assertRegularExpression(false, debugInfo)).toThrow()
    expect(() => assertRegularExpression(true, debugInfo)).toThrow()
    expect(() => assertRegularExpression([], debugInfo)).toThrow()
    expect(() => assertRegularExpression({}, debugInfo)).toThrow()
  })

  function toNormalExpressionNode(arr: number[]): NormalExpressionNode {
    const astNodes: AstNode[] = arr.map(n => ({
      t: AstNodeType.Number,
      v: n,
      tkn: { t: TokenType.Name, v: `X` },
    }))
    return {
      n: `let`,
      p: astNodes,
      t: AstNodeType.NormalExpression,
      tkn: { t: TokenType.Name, v: `X` },
    }
  }

  test(`assertLengthEven`, () => {
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([]))).not.toThrow()
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([0]))).toThrow()
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([0, 1]))).not.toThrow()
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([0, 1, 2]))).toThrow()
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([0, 1, 2, 3]))).not.toThrow()
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([0, 1, 2, 3, 4]))).toThrow()
    expect(() => assertEventNumberOfParams(toNormalExpressionNode([0, 1, 2, 3, 4, 5]))).not.toThrow()
  })

  test(`assertLength`, () => {
    expect(() => assertNumberOfParams(0, toNormalExpressionNode([]))).not.toThrow()
    expect(() => assertNumberOfParams(0, toNormalExpressionNode([1]))).toThrow()
    expect(() => assertNumberOfParams(1, toNormalExpressionNode([1]))).not.toThrow()
    expect(() => assertNumberOfParams(1, toNormalExpressionNode([]))).toThrow()
    expect(() => assertNumberOfParams(1, toNormalExpressionNode([1, 2]))).toThrow()
    expect(() => assertNumberOfParams(2, toNormalExpressionNode([1, 2]))).not.toThrow()
    expect(() => assertNumberOfParams(2, toNormalExpressionNode([1]))).toThrow()
    expect(() => assertNumberOfParams(2, toNormalExpressionNode([1, 2, 3]))).toThrow()
    expect(() => assertNumberOfParams({}, toNormalExpressionNode([]))).toThrow()
    expect(() => assertNumberOfParams({ min: 1 }, toNormalExpressionNode([1, 2, 3, 4, 5]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1 }, toNormalExpressionNode([1, 2, 3, 4]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1 }, toNormalExpressionNode([1, 2, 3]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1 }, toNormalExpressionNode([1, 2]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1 }, toNormalExpressionNode([1]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1 }, toNormalExpressionNode([]))).toThrow()
    expect(() => assertNumberOfParams({ max: 3 }, toNormalExpressionNode([1, 2, 3, 4, 5]))).toThrow()
    expect(() => assertNumberOfParams({ max: 3 }, toNormalExpressionNode([1, 2, 3, 4]))).toThrow()
    expect(() => assertNumberOfParams({ max: 3 }, toNormalExpressionNode([1, 2, 3]))).not.toThrow()
    expect(() => assertNumberOfParams({ max: 3 }, toNormalExpressionNode([1, 2]))).not.toThrow()
    expect(() => assertNumberOfParams({ max: 3 }, toNormalExpressionNode([1]))).not.toThrow()
    expect(() => assertNumberOfParams({ max: 3 }, toNormalExpressionNode([]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([]))).toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([1]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([1, 2]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([1, 2, 3]))).not.toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([1, 2, 3, 4]))).toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([1, 2, 3, 4, 5]))).toThrow()
    expect(() => assertNumberOfParams({ min: 1, max: 3 }, toNormalExpressionNode([1, 2, 3, 4, 5, 6]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([1]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([1, 2]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([1, 2, 3]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([1, 2, 3, 4]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([1, 2, 3, 4, 5]))).toThrow()
    expect(() => assertNumberOfParams({ min: 3, max: 1 }, toNormalExpressionNode([1, 2, 3, 4, 5, 6]))).toThrow()
  })

  test(`assertLitsFunction`, () => {
    const lf: LitsFunction = {
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
    expect(() => assertLitsFunction(lf, debugInfo)).not.toThrow()
    expect(() => assertLitsFunction(1, debugInfo)).toThrow()
    expect(() => assertLitsFunction({}, debugInfo)).toThrow()
  })
  test(`assertPositiveNumber`, () => {
    expect(() => assertNumber(-1, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(-0.5, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(0, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(0.5, debugInfo, { positive: true })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { positive: true })).not.toThrow()
    expect(() => assertNumber(`1`, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber({}, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(true, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { positive: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { positive: true })).toThrow()
  })
  test(`assertNegativeNumber`, () => {
    expect(() => assertNumber(-1, debugInfo, { negative: true })).not.toThrow()
    expect(() => assertNumber(-0.5, debugInfo, { negative: true })).not.toThrow()
    expect(() => assertNumber(0, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(0.5, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(1, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(`1`, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber({}, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(true, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { negative: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { negative: true })).toThrow()
  })
  test(`assertNonNegativeNumber`, () => {
    expect(() => assertNumber(-1, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber(-1.1, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber(0, debugInfo, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(0.1, debugInfo, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(1.1, debugInfo, { nonNegative: true })).not.toThrow()
    expect(() => assertNumber(`1`, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber({}, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber(true, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { nonNegative: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { nonNegative: true })).toThrow()
  })
  test(`assertNonPositiveNumber`, () => {
    expect(() => assertNumber(-1, debugInfo, { nonPositive: true })).not.toThrow()
    expect(() => assertNumber(-1.1, debugInfo, { nonPositive: true })).not.toThrow()
    expect(() => assertNumber(0, debugInfo, { nonPositive: true })).not.toThrow()
    expect(() => assertNumber(0.1, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(1, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(1.1, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(`1`, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber({}, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(true, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { nonPositive: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { nonPositive: true })).toThrow()
  })
  test(`assertFiniteNumber`, () => {
    expect(() => assertNumber(-1, debugInfo, { finite: true })).not.toThrow()
    expect(() => assertNumber(-1.1, debugInfo, { finite: true })).not.toThrow()
    expect(() => assertNumber(0, debugInfo, { finite: true })).not.toThrow()
    expect(() => assertNumber(0.1, debugInfo, { finite: true })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { finite: true })).not.toThrow()
    expect(() => assertNumber(1.1, debugInfo, { finite: true })).not.toThrow()
    expect(() => assertNumber(Math.asin(2), debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber(1 / 0, debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber(`1`, debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber({}, debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber(true, debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { finite: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { finite: true })).toThrow()
  })
  test(`asFiniteNumber`, () => {
    expect(asNumber(-1, debugInfo, { finite: true })).toBe(-1)
    expect(asNumber(-1.1, debugInfo, { finite: true })).toBe(-1.1)
    expect(asNumber(0, debugInfo, { finite: true })).toBe(0)
    expect(asNumber(0.1, debugInfo, { finite: true })).toBe(0.1)
    expect(asNumber(1, debugInfo, { finite: true })).toBe(1)
    expect(asNumber(1.1, debugInfo, { finite: true })).toBe(1.1)
    expect(() => asNumber(Math.asin(2), debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(1 / 0, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(`1`, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(`1`, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber([], debugInfo, { finite: true })).toThrow()
    expect(() => asNumber({}, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(true, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(false, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(null, debugInfo, { finite: true })).toThrow()
    expect(() => asNumber(undefined, debugInfo, { finite: true })).toThrow()
  })
  test(`assertNumberGt`, () => {
    expect(() => assertNumber(0, debugInfo, { gt: 1 })).toThrow()
    expect(() => assertNumber(0.5, debugInfo, { gt: 1 })).toThrow()
    expect(() => assertNumber(1, debugInfo, { gt: 1 })).toThrow()
    expect(() => assertNumber(1.5, debugInfo, { gt: 1 })).not.toThrow()
    expect(() => assertNumber(2, debugInfo, { gt: 1 })).not.toThrow()
    expect(() => assertNumber(`2`, debugInfo, { gt: 1 })).toThrow()
    expect(() => assertNumber([], debugInfo, { gt: 1 })).toThrow()
    expect(() => assertNumber(false, debugInfo, { gt: 1 })).toThrow()
  })
  test(`assertNumberGte`, () => {
    expect(() => assertNumber(0, debugInfo, { gte: 1 })).toThrow()
    expect(() => assertNumber(0.5, debugInfo, { gte: 1 })).toThrow()
    expect(() => assertNumber(1, debugInfo, { gte: 1 })).not.toThrow()
    expect(() => assertNumber(1.5, debugInfo, { gte: 1 })).not.toThrow()
    expect(() => assertNumber(2, debugInfo, { gte: 1 })).not.toThrow()
    expect(() => assertNumber(`2`, debugInfo, { gte: 1 })).toThrow()
    expect(() => assertNumber([], debugInfo, { gte: 1 })).toThrow()
    expect(() => assertNumber(false, debugInfo, { gte: 1 })).toThrow()
  })
  test(`assertNumberLt`, () => {
    expect(() => assertNumber(0, debugInfo, { lt: 1 })).not.toThrow()
    expect(() => assertNumber(0.5, debugInfo, { lt: 1 })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { lt: 1 })).toThrow()
    expect(() => assertNumber(1.5, debugInfo, { lt: 1 })).toThrow()
    expect(() => assertNumber(2, debugInfo, { lt: 1 })).toThrow()
    expect(() => assertNumber(`2`, debugInfo, { lt: 1 })).toThrow()
    expect(() => assertNumber([], debugInfo, { lt: 1 })).toThrow()
    expect(() => assertNumber(false, debugInfo, { lt: 1 })).toThrow()
  })
  test(`assertNumberLte`, () => {
    expect(() => assertNumber(0, debugInfo, { lte: 1 })).not.toThrow()
    expect(() => assertNumber(0.5, debugInfo, { lte: 1 })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { lte: 1 })).not.toThrow()
    expect(() => assertNumber(1.5, debugInfo, { lte: 1 })).toThrow()
    expect(() => assertNumber(2, debugInfo, { lte: 1 })).toThrow()
    expect(() => assertNumber(`2`, debugInfo, { lte: 1 })).toThrow()
    expect(() => assertNumber([], debugInfo, { lte: 1 })).toThrow()
    expect(() => assertNumber(false, debugInfo, { lte: 1 })).toThrow()
  })
  test(`assertNumberNotZero`, () => {
    expect(() => assertNumber(-1, debugInfo, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(-0.5, debugInfo, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(0, debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber(0.5, debugInfo, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(1, debugInfo, { nonZero: true })).not.toThrow()
    expect(() => assertNumber(`1`, debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber([], debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber({}, debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber(true, debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber(false, debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber(null, debugInfo, { nonZero: true })).toThrow()
    expect(() => assertNumber(undefined, debugInfo, { nonZero: true })).toThrow()
  })
  test(`assertString`, () => {
    expect(() => assertString(``, debugInfo)).not.toThrow()
    expect(() => assertString(`1`, debugInfo)).not.toThrow()
    expect(() => assertString(0, debugInfo)).toThrow()
    expect(() => assertString(1, debugInfo)).toThrow()
    expect(() => assertString(true, debugInfo)).toThrow()
    expect(() => assertString(false, debugInfo)).toThrow()
    expect(() => assertString(null, debugInfo)).toThrow()
    expect(() => assertString(undefined, debugInfo)).toThrow()
    expect(() => assertString([], debugInfo)).toThrow()
    expect(() => assertString({}, debugInfo)).toThrow()
  })
  test(`asString`, () => {
    expect(() => asString(``, debugInfo)).not.toThrow()
    expect(() => asString(`1`, debugInfo)).not.toThrow()
    expect(() => asString(0, debugInfo)).toThrow()
    expect(() => asString(1, debugInfo)).toThrow()
    expect(() => asString(true, debugInfo)).toThrow()
    expect(() => asString(false, debugInfo)).toThrow()
    expect(() => asString(null, debugInfo)).toThrow()
    expect(() => asString(undefined, debugInfo)).toThrow()
    expect(() => asString([], debugInfo)).toThrow()
    expect(() => asString({}, debugInfo)).toThrow()
  })
  test(`assertNonEmptyString`, () => {
    expect(() => assertString(`1`, debugInfo, { nonEmpty: true })).not.toThrow()
    expect(() => assertString(`abc`, debugInfo, { nonEmpty: true })).not.toThrow()
    expect(() => assertString(``, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString(0, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString(1, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString(true, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString(false, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString(null, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString(undefined, debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString([], debugInfo, { nonEmpty: true })).toThrow()
    expect(() => assertString({}, debugInfo, { nonEmpty: true })).toThrow()
  })

  test(`assertStringOrArray`, () => {
    expect(() => assertSeq(``, debugInfo)).not.toThrow()
    expect(() => assertSeq(`1`, debugInfo)).not.toThrow()
    expect(() => assertSeq([], debugInfo)).not.toThrow()
    expect(() => assertSeq([1, 2, 3], debugInfo)).not.toThrow()
    expect(() => assertSeq(0, debugInfo)).toThrow()
    expect(() => assertSeq(1, debugInfo)).toThrow()
    expect(() => assertSeq(true, debugInfo)).toThrow()
    expect(() => assertSeq(false, debugInfo)).toThrow()
    expect(() => assertSeq(null, debugInfo)).toThrow()
    expect(() => assertSeq(undefined, debugInfo)).toThrow()
    expect(() => assertSeq({}, debugInfo)).toThrow()
  })

  test(`assertStringOrRegExp`, () => {
    const a: RegularExpression = {
      [REGEXP_SYMBOL]: true,
      s: `^ab`,
      f: ``,
    }
    expect(() => assertStringOrRegularExpression(``, debugInfo)).not.toThrow()
    expect(() => assertStringOrRegularExpression(`1`, debugInfo)).not.toThrow()
    expect(() => assertStringOrRegularExpression(a, debugInfo)).not.toThrow()
    expect(() => assertStringOrRegularExpression(/^a/, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression([], debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression([1, 2, 3], debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression(0, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression(1, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression(true, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression(false, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression(null, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression(undefined, debugInfo)).toThrow()
    expect(() => assertStringOrRegularExpression({}, debugInfo)).toThrow()
  })

  test(`isLitsFunction`, () => {
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
    expect(isLitsFunction(lf1)).toBe(true)
    expect(isLitsFunction(lf2)).toBe(true)
    expect(isLitsFunction(lf3)).toBe(true)
    expect(isLitsFunction(lf4)).toBe(true)
    expect(isLitsFunction(lf5)).toBe(true)
    expect(isLitsFunction(``)).toBe(false)
    expect(isLitsFunction(`1`)).toBe(false)
    expect(isLitsFunction(0)).toBe(false)
    expect(isLitsFunction(1)).toBe(false)
    expect(isLitsFunction(true)).toBe(false)
    expect(isLitsFunction(false)).toBe(false)
    expect(isLitsFunction(null)).toBe(false)
    expect(isLitsFunction(undefined)).toBe(false)
    expect(isLitsFunction([])).toBe(false)
    expect(isLitsFunction({})).toBe(false)
  })

  test(`isNumber`, () => {
    expect(isNumber(1 / 0)).toBe(true)
    expect(isNumber(Number(`abc`))).toBe(true)
    expect(isNumber(0.12)).toBe(true)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(`undefined`)).toBe(false)
    expect(isNumber([])).toBe(false)
  })

  test(`asInteger`, () => {
    expect(() => asNumber(1 / 0, `EOF`, { integer: true })).toThrow()
    expect(() => asNumber(Number(`abc`), `EOF`, { integer: true })).toThrow()
    expect(() => asNumber(12, `EOF`, { integer: true })).not.toThrow()
    expect(() => asNumber(undefined, `EOF`, { integer: true })).toThrow()
    expect(() => asNumber(`undefined`, `EOF`, { integer: true })).toThrow()
    expect(() => asNumber([], `EOF`, { integer: true })).toThrow()
  })

  test(`isInteger`, () => {
    expect(isNumber(1 / 0, { integer: true })).toBe(false)
    expect(isNumber(Number(`abc`), { integer: true })).toBe(false)
    expect(isNumber(0.12, { integer: true })).toBe(false)
    expect(isNumber(-12, { integer: true })).toBe(true)
    expect(isNumber(0, { integer: true })).toBe(true)
    expect(isNumber(12, { integer: true })).toBe(true)
    expect(isNumber(undefined, { integer: true })).toBe(false)
    expect(isNumber(`undefined`, { integer: true })).toBe(false)
    expect(isNumber([], { integer: true })).toBe(false)
  })

  test(`assertNumber`, () => {
    expect(() => assertNumber(1 / 0, debugInfo)).not.toThrow()
    expect(() => assertNumber(Number(`abc`), debugInfo)).not.toThrow()
    expect(() => assertNumber(0.12, debugInfo)).not.toThrow()
    expect(() => assertNumber(undefined, debugInfo)).toThrow()
    expect(() => assertNumber(`undefined`, debugInfo)).toThrow()
    expect(() => assertNumber([], debugInfo)).toThrow()
  })

  test(`isRegexp`, () => {
    const a: RegularExpression = {
      [REGEXP_SYMBOL]: true,
      s: `^ab`,
      f: ``,
    }

    expect(isRegularExpression(`Hej`)).toBe(false)
    expect(isRegularExpression({})).toBe(false)
    expect(isRegularExpression(a)).toBe(true)
  })

  test(`isNormalExpressionNodeName`, () => {
    expect(
      isNormalExpressionNodeWithName({
        t: AstNodeType.NormalExpression,
        p: [],
        n: `object`,
        tkn: { t: TokenType.Name, v: `X` },
      }),
    ).toBe(true)

    const ne: NormalExpressionNode = {
      t: AstNodeType.NormalExpression,
      p: [],
      e: {
        t: AstNodeType.NormalExpression,
        n: `+`,
        p: [
          {
            t: AstNodeType.Number,
            v: 2,
            tkn: { t: TokenType.Name, v: `X` },
          },
        ],
      },
    }
    expect(isNormalExpressionNodeWithName(ne)).toBe(false)

    const ne2 = {
      p: [],
      e: {
        t: AstNodeType.NormalExpression,
        n: `+`,
        p: [
          {
            t: AstNodeType.Number,
            v: 2,
            tkn: { t: TokenType.Name, v: `X` },
          },
        ],
      },
    }
    expect(isNormalExpressionNodeWithName(ne2)).toBe(false)
  })

  test(`assertMax`, () => {
    expect(() => assertNumber(12, debugInfo, { lte: 10 })).toThrow()
    expect(() => assertNumber(-12, debugInfo, { lte: -10 })).not.toThrow()
    expect(() => assertNumber(-8, debugInfo, { lte: -10 })).toThrow()
    expect(() => assertNumber(10, debugInfo, { lte: 10 })).not.toThrow()
    expect(() => assertNumber(0, debugInfo, { lte: 10 })).not.toThrow()
  })
  test(`assertChar`, () => {
    expect(() => assertString(`2`, debugInfo, { char: true })).not.toThrow()
    expect(() => assertString(`Albert`, debugInfo, { char: true })).toThrow()
    expect(() => assertString(0, debugInfo, { char: true })).toThrow()
    expect(() => assertString(null, debugInfo, { char: true })).toThrow()
    expect(() => assertString(true, debugInfo, { char: true })).toThrow()
    expect(() => assertString(false, debugInfo, { char: true })).toThrow()
    expect(() => assertString([`a`], debugInfo, { char: true })).toThrow()
    expect(() => assertString({ a: `a` }, debugInfo, { char: true })).toThrow()
  })
  test(`asChar`, () => {
    expect(asString(`2`, debugInfo, { char: true })).toBe(`2`)
    expect(() => asString(`Albert`, debugInfo, { char: true })).toThrow()
    expect(() => asString(0, debugInfo, { char: true })).toThrow()
    expect(() => asString(null, debugInfo, { char: true })).toThrow()
    expect(() => asString(true, debugInfo, { char: true })).toThrow()
    expect(() => asString(false, debugInfo, { char: true })).toThrow()
    expect(() => asString([`a`], debugInfo, { char: true })).toThrow()
    expect(() => asString({ a: `a` }, debugInfo, { char: true })).toThrow()
  })

  test(`asColl`, () => {
    expect(asColl(`2`, debugInfo)).toEqual(`2`)
    expect(asColl({ a: 1 }, debugInfo)).toEqual({ a: 1 })
    expect(asColl([2], debugInfo)).toEqual([2])
    expect(() => asColl(0, debugInfo)).toThrow()
    expect(() => asColl(null, debugInfo)).toThrow()
    expect(() => asColl(true, debugInfo)).toThrow()
    expect(() => asColl(false, debugInfo)).toThrow()
  })

  test(`expressionNode`, () => {
    expect(isExpressionNode(`2`)).toBe(false)
  })

  test(`isAstNode`, () => {
    const node: AstNode = {
      t: AstNodeType.Name,
      tkn: { d: `EOF`, t: TokenType.Bracket, v: `(` },
      v: `A name`,
    }
    const nonNode = {
      ...node,
      t: `name`,
    }
    expect(isAstNode(node)).toBe(true)
    expect(isAstNode(nonNode)).toBe(false)
  })

  test(`number`, () => {
    expect(() => assertNumber(0, `EOF`, { zero: true })).not.toThrow()
    expect(() => assertNumber(1, `EOF`, { zero: true })).toThrow()
    expect(() => assertNumber(1.5, `EOF`, { gt: 1, lt: 2 })).not.toThrow()
    expect(() => assertNumber(1, `EOF`, { gt: 1, lt: 2 })).toThrow()
    expect(() => assertNumber(2, `EOF`, { gt: 1, lt: 2 })).toThrow()
    expect(() => assertNumber(1.5, `EOF`, { gte: 1, lte: 2 })).not.toThrow()
    expect(() => assertNumber(1, `EOF`, { gte: 1, lte: 2 })).not.toThrow()
    expect(() => assertNumber(2.5, `EOF`, { gte: 1, lte: 2 })).toThrow()
  })
  test(`character`, () => {
    expect(() => assertString(`k`, `EOF`, { char: true })).not.toThrow()
    expect(() => assertString(`k1`, `EOF`, { char: true })).toThrow()
    expect(() => assertString(1, `EOF`, { char: true })).toThrow()
  })

  test(`token`, () => {
    const tkn: Token = {
      d: `EOF`,
      t: TokenType.Name,
      v: `Albert`,
    }
    const nonTkn1 = {
      ...tkn,
      t: 999,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nonTkn2: any = {
      ...tkn,
    }
    delete nonTkn2.v
    expect(isToken(tkn)).toBe(true)
    expect(isToken(nonTkn1)).toBe(false)
    expect(isToken(10)).toBe(false)
    expect(() => assertToken(tkn, `EOF`)).not.toThrow()
    expect(() => assertToken(nonTkn2, `EOF`)).toThrow()
    expect(() => assertToken(nonTkn2, `EOF`)).toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Name })).not.toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Number })).toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Name, value: `Albert` })).not.toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Name, value: `Mojir` })).toThrow()
  })
})
