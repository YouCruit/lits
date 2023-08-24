import {
  asNonUndefined,
  assertNonUndefined,
  assertEventNumberOfParams,
  assertNumberOfParams,
  isUnknownRecord,
  asUnknownRecord,
  assertUnknownRecord,
} from '.'
import { testTypeGuars } from '../../__tests__/testUtils'
import { AstNodeType, TokenType } from '../constants/constants'
import type { AstNode, NormalExpressionNode } from '../parser/interface'

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

describe(`typeGuards index file`, () => {
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

  test(`UnknownRecord`, () => {
    const valid = [{}, { a: 1 }]
    const invalid = [undefined, null, 0, false, true, ``, `foo`, []]
    testTypeGuars(
      {
        valid,
        invalid,
      },
      { is: isUnknownRecord, as: asUnknownRecord, assert: assertUnknownRecord },
    )
  })
})
