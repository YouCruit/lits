import {
  asNonUndefined,
  asUnknownRecord,
  assertEventNumberOfParams,
  assertNonUndefined,
  assertNumberOfParams,
  assertUnknownRecord,
  isUnknownRecord,
} from '.'
import { testTypeGuars } from '../../__tests__/testUtils'
import { AstNodeType, TokenType } from '../constants/constants'
import type { AstNode, NormalExpressionNode } from '../parser/interface'
import type { DebugInfo } from '../tokenizer/interface'

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

const debugInfo: DebugInfo = {
  code: ``,
}

describe(`typeGuards index file`, () => {
  test(`asNotUndefined`, () => {
    expect(() => asNonUndefined(undefined, debugInfo)).toThrow()
    expect(asNonUndefined(null, debugInfo)).toBe(null)
    expect(asNonUndefined(false, debugInfo)).toBe(false)
    expect(asNonUndefined(true, debugInfo)).toBe(true)
    expect(asNonUndefined(0, debugInfo)).toBe(0)
    const obj = {}
    expect(asNonUndefined(obj, debugInfo)).toBe(obj)
  })
  test(`assertNotUndefined`, () => {
    expect(() => assertNonUndefined(undefined, debugInfo)).toThrow()
    expect(() => assertNonUndefined(undefined, debugInfo)).toThrow()
    expect(() => assertNonUndefined(null, debugInfo)).not.toThrow()
    expect(() => assertNonUndefined(false, debugInfo)).not.toThrow()
    expect(() => assertNonUndefined(true, debugInfo)).not.toThrow()
    expect(() => assertNonUndefined(0, debugInfo)).not.toThrow()
    expect(() => assertNonUndefined({}, debugInfo)).not.toThrow()
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
