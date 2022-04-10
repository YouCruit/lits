import {
  NormalExpressionNode,
  SpecialExpressionNode,
  NameNode,
  NumberNode,
  StringNode,
  ReservedNameNode,
  FUNCTION_SYMBOL,
  NormalExpressionNodeWithName,
  BuiltinFunction,
} from '../parser/interface'
import { Ast } from '../parser/interface'
import { builtin } from '../builtin'
import { reservedNamesRecord } from '../reservedNames'
import { toAny } from '../utils'
import { Context, EvaluateAstNode, ExecuteFunction } from './interface'
import { Any, Arr, Obj } from '../interface'
import { ContextStack } from './interface'
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

export function createContextStack(contexts: Context[] = []): ContextStack {
  if (contexts.length === 0) {
    contexts.push({})
  }

  return new ContextStackImpl(contexts, 0)
}

class ContextStackImpl implements ContextStack {
  public stack: Context[]
  public globalContext: Context
  public numberOfImportedContexts: number
  constructor(contexts: Context[], globalContextIndex: number) {
    this.stack = contexts
    this.numberOfImportedContexts = contexts.length - (globalContextIndex + 1)
    this.globalContext = contexts[globalContextIndex] as Context
  }

  public withContext(context: Context): ContextStack {
    return new ContextStackImpl([context, ...this.stack], this.stack.length - this.numberOfImportedContexts)
  }
}

export function evaluate(ast: Ast, contextStack: ContextStack): Any {
  let result: Any = null
  for (const node of ast.body) {
    result = evaluateAstNode(node, contextStack)
  }
  return result
}

export const evaluateAstNode: EvaluateAstNode = (node, contextStack) => {
  switch (node.type) {
    case `Number`:
      return evaluateNumber(node)
    case `String`:
      return evaluateString(node)
    case `Name`:
      return evaluateName(node, contextStack)
    case `ReservedName`:
      return evaluateReservedName(node)
    case `NormalExpression`:
      return evaluateNormalExpression(node, contextStack)
    case `SpecialExpression`:
      return evaluateSpecialExpression(node, contextStack)
    default:
      throw new LitsError(`${node.type}-node cannot be evaluated`, node.token.debugInfo)
  }
}

function evaluateNumber(node: NumberNode): number {
  return node.value
}

function evaluateString(node: StringNode): string {
  return node.value
}

function evaluateReservedName(node: ReservedNameNode): Any {
  return asValue(reservedNamesRecord[node.value], node.token.debugInfo).value
}

function evaluateName(node: NameNode, contextStack: ContextStack): Any {
  const {
    value,
    token: { debugInfo },
  } = node
  for (const context of contextStack.stack) {
    const variable = context[value]
    if (variable) {
      return variable.value
    }
  }
  if (builtin.normalExpressions[value]) {
    const builtinFunction: BuiltinFunction = {
      [FUNCTION_SYMBOL]: true,
      debugInfo: node.token.debugInfo,
      type: `builtin`,
      name: value,
    }
    return builtinFunction
  }

  throw new UndefinedSymbolError(value, debugInfo)
}

function evaluateNormalExpression(node: NormalExpressionNode, contextStack: ContextStack): Any {
  const params = node.params.map(paramNode => evaluateAstNode(paramNode, contextStack))
  const { debugInfo } = node.token
  if (normalExpressionNodeWithName.is(node)) {
    for (const context of contextStack.stack) {
      const fn = context[node.name]?.value
      if (fn === undefined) {
        continue
      }
      return executeFunction(fn, params, debugInfo, contextStack)
    }

    return evaluateBuiltinNormalExpression(node, params, contextStack)
  } else {
    const fn = evaluateAstNode(node.expression, contextStack)
    return executeFunction(fn, params, debugInfo, contextStack)
  }
}

const executeFunction: ExecuteFunction = (fn, params, debugInfo, contextStack) => {
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
    throw new UndefinedSymbolError(node.name, node.token.debugInfo)
  }

  return normalExpression.evaluate(params, node.token.debugInfo, contextStack, { executeFunction })
}

function evaluateSpecialExpression(node: SpecialExpressionNode, contextStack: ContextStack): Any {
  const specialExpression = asValue(builtin.specialExpressions[node.name], node.token.debugInfo)

  return specialExpression.evaluate(node, contextStack, { evaluateAstNode, builtin })
}

function evalueateObjectAsFunction(fn: Obj, params: Arr, debugInfo: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`Object as function requires one string parameter.`, debugInfo)
  }
  const key = params[0]
  string.assert(key, debugInfo)
  return toAny(fn[key])
}

function evaluateArrayAsFunction(fn: Arr, params: Arr, debugInfo: DebugInfo): Any {
  if (params.length !== 1) {
    throw new LitsError(`Array as function requires one non negative integer parameter.`, debugInfo)
  }
  const index = params[0]
  number.assert(index, debugInfo, { integer: true, nonNegative: true })
  return toAny(fn[index])
}

function evaluateStringAsFunction(fn: string, params: Arr, debugInfo: DebugInfo): Any {
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

function evaluateNumberAsFunction(fn: number, params: Arr, debugInfo: DebugInfo): Any {
  number.assert(fn, debugInfo, { integer: true })
  if (params.length !== 1) {
    throw new LitsError(`String as function requires one Arr parameter.`, debugInfo)
  }
  const param = params[0]
  sequence.assert(param, debugInfo)
  return toAny(param[fn])
}
