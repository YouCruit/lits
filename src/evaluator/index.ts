import type {
  NormalExpressionNode,
  NumberNode,
  StringNode,
  ReservedNameNode,
  NormalExpressionNodeWithName,
  SpecialExpressionNode,
} from '../parser/interface'
import type { Ast } from '../parser/interface'
import { builtin } from '../builtin'
import { reservedNamesRecord } from '../reservedNames'
import { toAny } from '../utils'
import type { Context, ContextEntry, EvaluateAstNode, ExecuteFunction } from './interface'
import type { Any, Arr, Obj } from '../interface'
import { functionExecutors } from './functionExecutors'
import type { DebugInfo } from '../tokenizer/interface'
import { LitsError, NotAFunctionError, UndefinedSymbolError } from '../errors'
import { AstNodeType } from '../constants/constants'
import type { ContextStack } from './ContextStack'
import { isNormalExpressionNodeWithName } from '../typeGuards/astNode'
import { valueToString } from '../utils/debug/debugTools'
import { isLitsFunction } from '../typeGuards/litsFunction'
import { assertNumber, isNumber } from '../typeGuards/number'
import { asNonUndefined } from '../typeGuards'
import { asAny, isObj, assertSeq } from '../typeGuards/lits'
import { assertString } from '../typeGuards/string'

export function evaluate(ast: Ast, contextStack: ContextStack): Any {
  let result: Any = null
  for (const node of ast.b) {
    result = evaluateAstNode(node, contextStack)
  }
  return result
}

export const evaluateAstNode: EvaluateAstNode = (node, contextStack) => {
  switch (node.t) {
    case AstNodeType.Number:
      return evaluateNumber(node)
    case AstNodeType.String:
      return evaluateString(node)
    case AstNodeType.Name:
      return contextStack.evaluateName(node)
    case AstNodeType.ReservedName:
      return evaluateReservedName(node)
    case AstNodeType.NormalExpression:
      return evaluateNormalExpression(node, contextStack)
    case AstNodeType.SpecialExpression:
      return evaluateSpecialExpression(node, contextStack)
    default:
      throw new LitsError(`${node.t}-node cannot be evaluated`, node.tkn?.d)
  }
}

function evaluateNumber(node: NumberNode): number {
  return node.v
}

function evaluateString(node: StringNode): string {
  return node.v
}

function evaluateReservedName(node: ReservedNameNode): Any {
  return asNonUndefined(reservedNamesRecord[node.v], node.tkn?.d).value
}

function evaluateNormalExpression(node: NormalExpressionNode, contextStack: ContextStack): Any {
  const params = node.p.map(paramNode => evaluateAstNode(paramNode, contextStack))
  const debugInfo = node.tkn?.d
  if (isNormalExpressionNodeWithName(node)) {
    const value = contextStack.getValue(node.n)
    if (value !== undefined) {
      return executeFunction(asAny(value), params, contextStack, debugInfo)
    }
    return evaluateBuiltinNormalExpression(node, params, contextStack)
  } else {
    const fn = evaluateAstNode(node.e, contextStack)
    return executeFunction(fn, params, contextStack, debugInfo)
  }
}

const executeFunction: ExecuteFunction = (fn, params, contextStack, debugInfo) => {
  if (isLitsFunction(fn)) {
    return functionExecutors[fn.t](fn, params, debugInfo, contextStack, { evaluateAstNode, executeFunction })
  }
  if (Array.isArray(fn)) {
    return evaluateArrayAsFunction(fn, params, debugInfo)
  }
  if (isObj(fn)) {
    return evalueateObjectAsFunction(fn, params, debugInfo)
  }
  if (typeof fn === `string`) {
    return evaluateStringAsFunction(fn, params, debugInfo)
  }
  if (isNumber(fn)) {
    return evaluateNumberAsFunction(fn, params, debugInfo)
  }
  throw new NotAFunctionError(fn, debugInfo)
}

function evaluateBuiltinNormalExpression(
  node: NormalExpressionNodeWithName,
  params: Arr,
  contextStack: ContextStack,
): Any {
  const normalExpression = builtin.normalExpressions[node.n]
  if (!normalExpression) {
    throw new UndefinedSymbolError(node.n, node.tkn?.d)
  }

  return normalExpression.evaluate(params, node.tkn?.d, contextStack, { executeFunction })
}

function evaluateSpecialExpression(node: SpecialExpressionNode, contextStack: ContextStack): Any {
  const specialExpression = asNonUndefined(builtin.specialExpressions[node.n], node.tkn?.d)

  return specialExpression.evaluate(node, contextStack, { evaluateAstNode, builtin })
}

function evalueateObjectAsFunction(fn: Obj, params: Arr, debugInfo?: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`Object as function requires one string parameter.`, debugInfo)
  }
  const key = params[0]
  assertString(key, debugInfo)
  return toAny(fn[key])
}

function evaluateArrayAsFunction(fn: Arr, params: Arr, debugInfo?: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`Array as function requires one non negative integer parameter.`, debugInfo)
  }
  const index = params[0]
  assertNumber(index, debugInfo, { integer: true, nonNegative: true })
  return toAny(fn[index])
}

function evaluateStringAsFunction(fn: string, params: Arr, debugInfo?: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`String as function requires one Obj parameter.`, debugInfo)
  }
  const param = toAny(params[0])
  if (isObj(param)) {
    return toAny((param as Obj)[fn])
  }
  if (isNumber(param, { integer: true })) {
    return toAny(fn[param])
  }
  throw new LitsError(`string as function expects Obj or integer parameter, got ${valueToString(param)}`, debugInfo)
}

function evaluateNumberAsFunction(fn: number, params: Arr, debugInfo?: DebugInfo): Any {
  assertNumber(fn, debugInfo, { integer: true })
  if (params.length !== 1) {
    throw new LitsError(`Number as function requires one Arr parameter.`, debugInfo)
  }
  const param = params[0]
  assertSeq(param, debugInfo)
  return toAny(param[fn])
}

export function contextToString(context: Context) {
  if (Object.keys(context).length === 0) {
    return `  <empty>\n`
  }
  const maxKeyLength = Math.max(...Object.keys(context).map(key => key.length))
  return Object.entries(context).reduce((result, entry) => {
    const key = `${entry[0]}`.padEnd(maxKeyLength + 2, ` `)
    return `${result}  ${key}${contextEntryToString(entry[1])}\n`
  }, ``)
}

function contextEntryToString(contextEntry: ContextEntry): string {
  const { value } = contextEntry
  if (isLitsFunction(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const name: string | undefined = (value as any).n
    //TODO value.t makes littl sence, should be mapped to a type name
    if (name) {
      return `<${value.t} function ${name}>`
    } else {
      return `<${value.t} function λ>`
    }
  }
  return JSON.stringify(contextEntry.value)
}
