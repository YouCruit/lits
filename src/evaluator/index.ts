import {
  NormalExpressionNode,
  NameNode,
  NumberNode,
  StringNode,
  ReservedNameNode,
  NormalExpressionNodeWithName,
  SpecialExpressionNode,
  TypeNameNode,
} from '../parser/interface'
import { Ast } from '../parser/interface'
import { builtin } from '../builtin'
import { reservedNamesRecord } from '../reservedNames'
import { MAX_NUMBER, MIN_NUMBER, toAny } from '../utils'
import { EvaluateAstNode, ExecuteFunction } from './interface'
import { Any, Arr, Obj } from '../interface'
import { functionExecutors } from './functionExecutors'
import { DebugInfo } from '../tokenizer/interface'
import { LitsError, NotAFunctionError, UndefinedSymbolError } from '../errors'
import {
  asValue,
  litsFunction,
  normalExpressionNodeWithName,
  number,
  object,
  sequence,
  string,
} from '../utils/assertion'
import { valueToString } from '../utils/helpers'
import { ContextStack } from '../ContextStack'
import { lookUp } from '../lookup'
import { DataType } from '../analyze/dataTypes/DataType'

export function evaluate(ast: Ast, contextStack: ContextStack): Any {
  let result: Any = null
  for (const node of ast.body) {
    result = evaluateAstNode(node, contextStack)
  }
  return typeof result === `number` ? toSafeNumber(result) : result
}

function toSafeNumber(value: number): number {
  return value < MAX_NUMBER && value > MIN_NUMBER
    ? value
    : value < MIN_NUMBER
    ? Number.NEGATIVE_INFINITY
    : value > MAX_NUMBER
    ? Number.POSITIVE_INFINITY
    : value
}

export const evaluateAstNode: EvaluateAstNode = (node, contextStack) => {
  switch (node.type) {
    case `Number`:
      return evaluateNumber(node)
    case `String`:
      return evaluateString(node)
    case `TypeName`:
      return evaluateTypeName(node)
    case `Name`:
      return evaluateName(node, contextStack)
    case `ReservedName`:
      return evaluateReservedName(node)
    case `NormalExpression`:
      return evaluateNormalExpression(node, contextStack)
    case `SpecialExpression`:
      return evaluateSpecialExpression(node, contextStack)
    default:
      throw new LitsError(`${node.type}-node cannot be evaluated`, node.token?.debugInfo)
  }
}

function evaluateNumber(node: NumberNode): number {
  return toSafeNumber(node.value)
}

function evaluateString(node: StringNode): string {
  return node.value
}

function evaluateTypeName(node: TypeNameNode): DataType {
  switch (node.value) {
    case `never`:
      return DataType.never
    case `nil`:
      return DataType.nil
    case `nan`:
      return DataType.nan
    case `empty-string`:
      return DataType.emptyString
    case `non-empty-string`:
      return DataType.nonEmptyString
    case `string`:
      return DataType.string
    case `number`:
      return DataType.number
    case `float`:
      return DataType.float
    case `illegal-number`:
      return DataType.illegalNumber
    case `positive-infinity`:
      return DataType.positiveInfinity
    case `negative-infinity`:
      return DataType.negativeInfinity
    case `infinity`:
      return DataType.infinity
    case `zero`:
      return DataType.zero
    case `non-zero-float`:
      return DataType.nonZeroFloat
    case `positive-float`:
      return DataType.positiveFloat
    case `negative-float`:
      return DataType.negativeFloat
    case `non-positive-float`:
      return DataType.nonPositiveFloat
    case `non-negative-float`:
      return DataType.nonNegativeFloat
    case `integer`:
      return DataType.integer
    case `non-zero-integer`:
      return DataType.nonZeroInteger
    case `positive-integer`:
      return DataType.positiveInteger
    case `negative-integer`:
      return DataType.negativeInteger
    case `non-positive-integer`:
      return DataType.nonPositiveInteger
    case `non-negative-integer`:
      return DataType.nonNegativeInteger
    case `true`:
      return DataType.true
    case `false`:
      return DataType.false
    case `boolean`:
      return DataType.boolean
    case `empty-array`:
      return DataType.emptyArray
    case `non-empty-array`:
      return DataType.nonEmptyArray
    case `array`:
      return DataType.array
    case `empty-object`:
      return DataType.emptyObject
    case `non-empty-object`:
      return DataType.nonEmptyObject
    case `object`:
      return DataType.object
    case `regexp`:
      return DataType.regexp
    case `function`:
      return DataType.function
    case `unknown`:
      return DataType.unknown
    case `truthy`:
      return DataType.truthy
    case `falsy`:
      return DataType.falsy
    case `empty-collection`:
      return DataType.emptyCollection
    case `non-empty-collection`:
      return DataType.nonEmptyCollection
    case `collection`:
      return DataType.collection
    case `empty-sequence`:
      return DataType.emptySequence
    case `non-empty-sequence`:
      return DataType.nonEmptySequence
    case `sequence`:
      return DataType.sequence
  }
}

function evaluateReservedName(node: ReservedNameNode): Any {
  return asValue(reservedNamesRecord[node.value], node.token?.debugInfo).value
}

function evaluateName(node: NameNode, contextStack: ContextStack): Any {
  const lookUpResult = lookUp(node, contextStack)
  if (lookUpResult.contextEntry) {
    return lookUpResult.contextEntry.value
  } else if (lookUpResult.builtinFunction) {
    return lookUpResult.builtinFunction
  }
  throw new UndefinedSymbolError(node.value, node.token?.debugInfo)
}

function evaluateNormalExpression(node: NormalExpressionNode, contextStack: ContextStack): Any {
  const params = node.params.map(paramNode => evaluateAstNode(paramNode, contextStack))
  const debugInfo = node.token?.debugInfo
  if (normalExpressionNodeWithName.is(node)) {
    for (const context of contextStack.stack) {
      const fn = context[node.name]?.value
      if (fn === undefined) {
        continue
      }
      return executeFunction(fn, params, contextStack, debugInfo)
    }

    return evaluateBuiltinNormalExpression(node, params, contextStack)
  } else {
    const fn = evaluateAstNode(node.expression, contextStack)
    return executeFunction(fn, params, contextStack, debugInfo)
  }
}

const executeFunction: ExecuteFunction = (fn, params, contextStack, debugInfo) => {
  if (litsFunction.is(fn)) {
    return functionExecutors[fn.type](fn, params, debugInfo, contextStack, { evaluateAstNode, executeFunction })
  }
  if (Array.isArray(fn)) {
    return evaluateArrayAsFunction(fn, params, debugInfo)
  }
  if (object.is(fn)) {
    return evalueateObjectAsFunction(fn, params, debugInfo)
  }
  if (string.is(fn)) {
    return evaluateStringAsFunction(fn, params, debugInfo)
  }
  if (number.is(fn)) {
    return evaluateNumberAsFunction(fn, params, debugInfo)
  }
  throw new NotAFunctionError(fn, debugInfo)
}

function evaluateBuiltinNormalExpression(
  node: NormalExpressionNodeWithName,
  params: Arr,
  contextStack: ContextStack,
): Any {
  const normalExpression = builtin.normalExpressions[node.name]
  if (!normalExpression) {
    throw new UndefinedSymbolError(node.name, node.token?.debugInfo)
  }

  return normalExpression.evaluate(params, node.token?.debugInfo, contextStack, { executeFunction })
}

function evaluateSpecialExpression(node: SpecialExpressionNode, contextStack: ContextStack): Any {
  const specialExpression = asValue(builtin.specialExpressions[node.name], node.token?.debugInfo)

  return specialExpression.evaluate(node, contextStack, { evaluateAstNode, builtin, lookUp })
}

function evalueateObjectAsFunction(fn: Obj, params: Arr, debugInfo?: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`Object as function requires one string parameter.`, debugInfo)
  }
  const key = params[0]
  string.assert(key, debugInfo)
  return toAny(fn[key])
}

function evaluateArrayAsFunction(fn: Arr, params: Arr, debugInfo?: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`Array as function requires one non negative integer parameter.`, debugInfo)
  }
  const index = params[0]
  number.assert(index, debugInfo, { integer: true, nonNegative: true })
  return toAny(fn[index])
}

function evaluateStringAsFunction(fn: string, params: Arr, debugInfo?: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`String as function requires one Obj parameter.`, debugInfo)
  }
  const param = toAny(params[0])
  if (object.is(param)) {
    return toAny((param as Obj)[fn])
  }
  if (number.is(param, { integer: true })) {
    return toAny(fn[param])
  }
  throw new LitsError(`string as function expects Obj or integer parameter, got ${valueToString(param)}`, debugInfo)
}

function evaluateNumberAsFunction(fn: number, params: Arr, debugInfo?: DebugInfo): Any {
  number.assert(fn, debugInfo, { integer: true })
  if (params.length !== 1) {
    throw new LitsError(`Number as function requires one Arr parameter.`, debugInfo)
  }
  const param = params[0]
  sequence.assert(param, debugInfo)
  return toAny(param[fn])
}
