import type { LazyValue } from '../Lits/Lits'
import { LitsError } from '../errors'
import { getAssertionError } from './getAssertionError'
import type { Any, Coll, Obj, Seq } from '../interface'
import { AstNodeType } from '../constants/constants'
import type {
  ExpressionNode,
  NormalExpressionNode,
  RegularExpression,
  SpecialExpressionNode,
} from '../parser/interface'
import type { DebugInfo } from '../tokenizer/interface'
import { isAstNode } from './astNodeAsserter'
import { valueToString } from './debugTools'
import { isLitsFunction } from './functionAsserter'
import { REGEXP_SYMBOL } from './symbols'
import { getDebugInfo } from './getDebugInfo'

export function isStringOrNumber(value: unknown): value is string | number {
  return typeof value === `string` || typeof value === `number`
}
export function asStringOrNumber(value: unknown, debugInfo?: DebugInfo): string | number {
  assertStringOrNumber(value, debugInfo)
  return value
}
export function assertStringOrNumber(value: unknown, debugInfo?: DebugInfo): asserts value is string | number {
  if (!isStringOrNumber(value)) {
    throw getAssertionError(`string or number`, value, debugInfo)
  }
}

export function asArray(value: unknown, debugInfo?: DebugInfo): unknown[] {
  assertArray(value, debugInfo)
  return value
}
export function assertArray(value: unknown, debugInfo?: DebugInfo): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw getAssertionError(`array`, value, debugInfo)
  }
}

export function isAny(value: unknown): value is Any {
  // TODO weak test
  return value !== undefined
}
export function asAny(value: unknown, debugInfo?: DebugInfo): Any {
  assertAny(value, debugInfo)
  return value
}
export function assertAny(value: unknown, debugInfo?: DebugInfo): asserts value is Any {
  if (!isAny(value)) {
    throw getAssertionError(`not undefined`, value, debugInfo)
  }
}

export function isSeq(value: unknown): value is Seq {
  return Array.isArray(value) || typeof value === `string`
}
export function asSeq(value: unknown, debugInfo?: DebugInfo): Seq {
  assertSeq(value, debugInfo)
  return value
}
export function assertSeq(value: unknown, debugInfo?: DebugInfo): asserts value is Seq {
  if (!isSeq(value)) {
    throw getAssertionError(`string or array`, value, debugInfo)
  }
}

export function isObj(value: unknown): value is Obj {
  return !(
    value === null ||
    typeof value !== `object` ||
    Array.isArray(value) ||
    value instanceof RegExp ||
    isLitsFunction(value) ||
    isRegularExpression(value)
  )
}
export function asObj(value: unknown, debugInfo?: DebugInfo): Obj {
  assertObj(value, debugInfo)
  return value
}
export function assertObj(value: unknown, debugInfo?: DebugInfo): asserts value is Obj {
  if (!isObj(value)) {
    throw getAssertionError(`object`, value, debugInfo)
  }
}

export function isColl(value: unknown): value is Coll {
  return isSeq(value) || isObj(value)
}
export function asColl(value: unknown, debugInfo?: DebugInfo): Coll {
  assertColl(value, debugInfo)
  return value
}
export function assertColl(value: unknown, debugInfo?: DebugInfo): asserts value is Coll {
  if (!isColl(value)) {
    throw getAssertionError(`string, array or object`, value, debugInfo)
  }
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === `string`)
}
export function asStringArray(value: unknown, debugInfo?: DebugInfo): string[] {
  assertStringArray(value, debugInfo)
  return value
}
export function assertStringArray(value: unknown, debugInfo?: DebugInfo): asserts value is string[] {
  if (!isStringArray(value)) {
    throw getAssertionError(`array of strings`, value, debugInfo)
  }
}

export function isCharArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === `string` && v.length === 1)
}
export function asCharArray(value: unknown, debugInfo?: DebugInfo): string[] {
  assertCharArray(value, debugInfo)
  return value
}
export function assertCharArray(value: unknown, debugInfo?: DebugInfo): asserts value is string[] {
  if (!isCharArray(value)) {
    throw getAssertionError(`array of strings`, value, debugInfo)
  }
}

export function isRegularExpression(regexp: unknown): regexp is RegularExpression {
  if (regexp === null || typeof regexp !== `object`) {
    return false
  }
  return !!(regexp as RegularExpression)[REGEXP_SYMBOL]
}
export function asRegularExpression(value: unknown, debugInfo?: DebugInfo): RegularExpression {
  assertRegularExpression(value, debugInfo)
  return value
}
export function assertRegularExpression(value: unknown, debugInfo?: DebugInfo): asserts value is RegularExpression {
  if (!isRegularExpression(value)) {
    throw getAssertionError(`RegularExpression`, value, debugInfo)
  }
}

export function isStringOrRegularExpression(value: unknown): value is string | RegularExpression {
  return isRegularExpression(value) || typeof value === `string`
}
export function asStringOrRegularExpression(value: unknown, debugInfo?: DebugInfo): string | RegularExpression {
  assertStringOrRegularExpression(value, debugInfo)
  return value
}
export function assertStringOrRegularExpression(
  value: unknown,
  debugInfo?: DebugInfo,
): asserts value is string | RegularExpression {
  if (!isStringOrRegularExpression(value)) {
    throw getAssertionError(`string or RegularExpression`, value, debugInfo)
  }
}

export function isExpressionNode(value: unknown): value is ExpressionNode {
  if (!isAstNode(value)) {
    return false
  }
  return (
    value.t === AstNodeType.NormalExpression ||
    value.t === AstNodeType.SpecialExpression ||
    value.t === AstNodeType.Number ||
    value.t === AstNodeType.String
  )
}
export function asExpressionNode(value: unknown, debugInfo?: DebugInfo): ExpressionNode {
  assertExpressionNode(value, debugInfo)
  return value
}
export function assertExpressionNode(value: unknown, debugInfo?: DebugInfo): asserts value is ExpressionNode {
  if (!isExpressionNode(value)) {
    throw getAssertionError(`ExpressionNode`, value, debugInfo)
  }
}

export function assertNumberOfParams(
  count: number | { min?: number; max?: number },
  node: NormalExpressionNode | SpecialExpressionNode,
): void {
  const length = node.p.length
  const debugInfo = node.tkn?.d
  if (typeof count === `number`) {
    if (length !== count) {
      throw new LitsError(
        `Wrong number of arguments to "${node.n}", expected ${count}, got ${valueToString(length)}.`,
        node.tkn?.d,
      )
    }
  } else {
    const { min, max } = count
    if (min === undefined && max === undefined) {
      throw new LitsError(`Min or max must be specified.`, debugInfo)
    }

    if (typeof min === `number` && length < min) {
      throw new LitsError(
        `Wrong number of arguments to "${node.n}", expected at least ${min}, got ${valueToString(length)}.`,
        debugInfo,
      )
    }

    if (typeof max === `number` && length > max) {
      throw new LitsError(
        `Wrong number of arguments to "${node.n}", expected at most ${max}, got ${valueToString(length)}.`,
        debugInfo,
      )
    }
  }
}

export function assertEventNumberOfParams(node: NormalExpressionNode): void {
  const length = node.p.length
  if (length % 2 !== 0) {
    throw new LitsError(
      `Wrong number of arguments, expected an even number, got ${valueToString(length)}.`,
      node.tkn?.d,
    )
  }
}

export function asValue<T>(value: T | undefined, debugInfo?: DebugInfo): T {
  if (value === undefined) {
    throw new LitsError(`Unexpected undefined`, getDebugInfo(value, debugInfo))
  }
  return value
}

export function assertValue<T>(value: T | undefined, debugInfo?: DebugInfo): asserts value is T {
  if (value === undefined) {
    throw new LitsError(`Unexpected undefined.`, getDebugInfo(value, debugInfo))
  }
}

/* istanbul ignore next */
export function assertUnreachable(_: never): never {
  throw new Error(`This should not be reached`)
}

export function isLazyValue(value: unknown): value is LazyValue {
  return isUnknownRecord(value) && !!value.read
}

export function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === `object` && !Array.isArray(value)
}

type StringAssertionOptions =
  | {
      nonEmpty?: true
      char?: never
    }
  | {
      nonEmpty?: never
      char?: true
    }

export function isString(value: unknown, options: StringAssertionOptions = {}): value is string {
  if (typeof value !== `string`) {
    return false
  }

  if (options.nonEmpty && value.length === 0) {
    return false
  }

  if (options.char && value.length !== 1) {
    return false
  }

  return true
}

export function assertString(
  value: unknown,
  debugInfo: DebugInfo | undefined,
  options: StringAssertionOptions = {},
): asserts value is string {
  if (!isString(value, options)) {
    throw new LitsError(
      `Expected ${options.nonEmpty ? `non empty string` : options.char ? `character` : `string`}, got ${valueToString(
        value,
      )}.`,
      getDebugInfo(value, debugInfo),
    )
  }
}

export function asString(
  value: unknown,
  debugInfo: DebugInfo | undefined,
  options: StringAssertionOptions = {},
): string {
  assertString(value, debugInfo, options)
  return value
}

type SignOptions =
  | {
      positive?: true
      negative?: never
      nonPositive?: never
      nonNegative?: never
      zero?: never
      nonZero?: never
    }
  | {
      positive?: never
      negative?: true
      nonPositive?: never
      nonNegative?: never
      zero?: never
      nonZero?: never
    }
  | {
      positive?: never
      negative?: never
      nonPositive?: true
      nonNegative?: never
      zero?: never
      nonZero?: never
    }
  | {
      positive?: never
      negative?: never
      nonPositive?: never
      nonNegative?: true
      zero?: never
      nonZero?: never
    }
  | {
      positive?: never
      negative?: never
      nonPositive?: never
      nonNegative?: never
      zero?: true
      nonZero?: never
    }
  | {
      positive?: never
      negative?: never
      nonPositive?: never
      nonNegative?: never
      zero?: never
      nonZero?: true
    }

type GtOptions =
  | {
      gt?: number
      gte?: never
    }
  | {
      gt?: never
      gte?: number
    }

type LtOptions =
  | {
      lt?: number
      lte?: never
    }
  | {
      lt?: never
      lte?: number
    }

type NumberOptions = {
  integer?: true
  finite?: true
} & SignOptions &
  GtOptions &
  LtOptions

function getRangeString(options: NumberOptions): string {
  const hasUpperAndLowerBound =
    (typeof options.gt === `number` || typeof options.gte === `number`) &&
    (typeof options.lt === `number` || typeof options.lte === `number`)
  if (hasUpperAndLowerBound) {
    return `${typeof options.gt === `number` ? `${options.gt} < n ` : `${options.gte} <= n `}${
      typeof options.lt === `number` ? `< ${options.lt}` : `<= ${options.lte}`
    }`
  } else if (typeof options.gt === `number` || typeof options.gte === `number`) {
    return `${typeof options.gt === `number` ? `n > ${options.gt}` : `n >= ${options.gte}`}`
  } else if (typeof options.lt === `number` || typeof options.lte === `number`) {
    return `${typeof options.lt === `number` ? `n < ${options.lt}` : `n <= ${options.lte}`}`
  } else return ``
}

function getNumberTypeName(options: NumberOptions): string {
  if (options.zero) {
    return `zero`
  }
  const sign = options.positive
    ? `positive`
    : options.negative
    ? `negative`
    : options.nonNegative
    ? `non negative`
    : options.nonPositive
    ? `non positive`
    : options.nonZero
    ? `non zero`
    : ``
  const numberType = options.integer ? `integer` : `number`
  const finite = options.finite ? `finite` : ``
  const range = getRangeString(options)

  return [sign, finite, numberType, range].filter(x => !!x).join(` `)
}

export function isNumber(value: unknown, options: NumberOptions = {}): value is number {
  if (typeof value !== `number`) {
    return false
  }
  if (options.integer && !Number.isInteger(value)) {
    return false
  }
  if (options.finite && !Number.isFinite(value)) {
    return false
  }
  if (options.zero && value !== 0) {
    return false
  }
  if (options.nonZero && value === 0) {
    return false
  }
  if (options.positive && value <= 0) {
    return false
  }
  if (options.negative && value >= 0) {
    return false
  }
  if (options.nonPositive && value > 0) {
    return false
  }
  if (options.nonNegative && value < 0) {
    return false
  }
  if (typeof options.gt === `number` && value <= options.gt) {
    return false
  }
  if (typeof options.gte === `number` && value < options.gte) {
    return false
  }
  if (typeof options.lt === `number` && value >= options.lt) {
    return false
  }
  if (typeof options.lte === `number` && value > options.lte) {
    return false
  }
  return true
}

export function assertNumber(
  value: unknown,
  debugInfo?: DebugInfo,
  options: NumberOptions = {},
): asserts value is number {
  if (!isNumber(value, options)) {
    throw new LitsError(
      `Expected ${getNumberTypeName(options)}, got ${valueToString(value)}.`,
      getDebugInfo(value, debugInfo),
    )
  }
}

export function asNumber(value: unknown, debugInfo: DebugInfo | undefined, options: NumberOptions = {}): number {
  assertNumber(value, debugInfo, options)
  return value
}
