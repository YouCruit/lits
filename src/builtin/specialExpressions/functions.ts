import { addAnalyzeResults, AnalyzeResult } from '../../analyze'
import { LitsError } from '../../errors'
import { Context, ContextStack, EvaluateAstNode } from '../../evaluator/interface'
import {
  AstNode,
  EvaluatedFunctionOverload,
  FUNCTION_SYMBOL,
  LitsFunction,
  NameNode,
  SpecialExpressionNode,
} from '../../parser/interface'
import { Token } from '../../tokenizer/interface'
import { nameNode, string, token } from '../../utils/assertion'
import { valueToString } from '../../utils/helpers'
import { BuiltinSpecialExpression, ParserHelpers } from '../interface'
import { Arity, assertNameNotDefined, FunctionArguments, FunctionOverload } from '../utils'

interface DefnSpecialExpressionNode extends SpecialExpressionNode {
  name: `defn`
  functionName: NameNode
  overloads: FunctionOverload[]
}

interface DefnsSpecialExpressionNode extends SpecialExpressionNode {
  name: `defns`
  functionName: AstNode
  overloads: FunctionOverload[]
}

export interface FnSpecialExpressionNode extends SpecialExpressionNode {
  name: `fn`
  overloads: FunctionOverload[]
}

type FunctionNode = DefnSpecialExpressionNode | DefnsSpecialExpressionNode | FnSpecialExpressionNode

type ExpressionsName = `defn` | `defns` | `fn`

function createParser(expressionName: ExpressionsName): BuiltinSpecialExpression<FunctionNode>[`parse`] {
  return (tokens, position, parsers) => {
    const firstToken = token.as(tokens[position], `EOF`)
    const { parseToken } = parsers
    let functionName = undefined
    if (expressionName === `defn` || expressionName === `defns`) {
      ;[position, functionName] = parseToken(tokens, position)
      if (expressionName === `defn`) {
        nameNode.assert(functionName, functionName.token?.debugInfo)
      }
    }

    let functionOverloades: FunctionOverload[]
    ;[position, functionOverloades] = parseFunctionOverloades(tokens, position, parsers)

    if (expressionName === `defn` || expressionName === `defns`) {
      return [
        position,
        {
          type: `SpecialExpression`,
          name: expressionName,
          functionName: functionName as AstNode,
          params: [],
          overloads: functionOverloades,
          token: firstToken.debugInfo ? firstToken : undefined,
        },
      ]
    }

    return [
      position,
      {
        type: `SpecialExpression`,
        name: expressionName,
        params: [],
        overloads: functionOverloades,
        token: firstToken.debugInfo ? firstToken : undefined,
      },
    ]
  }
}

function getFunctionName(
  expressionName: ExpressionsName,
  node: FunctionNode,
  contextStack: ContextStack,
  evaluateAstNode: EvaluateAstNode,
): string | undefined {
  const debugInfo = node.token?.debugInfo
  if (expressionName === `defn`) {
    return ((node as DefnSpecialExpressionNode).functionName as NameNode).value
  }
  if (expressionName === `defns`) {
    const name = evaluateAstNode((node as DefnsSpecialExpressionNode).functionName, contextStack)
    string.assert(name, debugInfo)
    return name
  }
  return undefined
}

function createEvaluator(expressionName: ExpressionsName): BuiltinSpecialExpression<LitsFunction | null>[`evaluate`] {
  return (node, contextStack, { evaluateAstNode, builtin }) => {
    castExpressionNode(node)
    const name = getFunctionName(expressionName, node, contextStack, evaluateAstNode)

    assertNameNotDefined(name, contextStack, builtin, node.token?.debugInfo)

    const evaluatedFunctionOverloades: EvaluatedFunctionOverload[] = []
    for (const functionOverload of node.overloads) {
      const functionContext: Context = {}

      const evaluatedFunctionOverload: EvaluatedFunctionOverload = {
        arguments: {
          mandatoryArguments: functionOverload.arguments.mandatoryArguments,
          restArgument: functionOverload.arguments.restArgument,
        },
        arity: functionOverload.arity,
        body: functionOverload.body,
        functionContext,
      }

      evaluatedFunctionOverloades.push(evaluatedFunctionOverload)
    }

    const litsFunction: LitsFunction = {
      [FUNCTION_SYMBOL]: true,
      debugInfo: node.token?.debugInfo,
      type: `user-defined`,
      name,
      overloads: evaluatedFunctionOverloades,
    }

    if (expressionName === `fn`) {
      return litsFunction
    }

    contextStack.globalContext[name as string] = { value: litsFunction }
    return null
  }
}

export const defnSpecialExpression: BuiltinSpecialExpression<LitsFunction | null> = {
  parse: createParser(`defn`),
  evaluate: createEvaluator(`defn`),
  analyze: (node, contextStack, { analyzeAst }) => {
    castDefnExpressionNode(node)
    contextStack.globalContext[node.functionName.value] = { value: true }

    const result: AnalyzeResult = { undefinedSymbols: new Set() }

    const newContext: Context = { [node.functionName.value]: { value: true } }

    const contextStackWithFunctionName = contextStack.withContext(newContext)

    for (const overload of node.overloads) {
      const newContext: Context = {}
      overload.arguments.mandatoryArguments.forEach(arg => {
        newContext[arg] = { value: true }
      })
      if (typeof overload.arguments.restArgument === `string`) {
        newContext[overload.arguments.restArgument] = { value: true }
      }
      const newContextStack = contextStackWithFunctionName.withContext(newContext)
      const overloadResult = analyzeAst(overload.body, newContextStack)
      addAnalyzeResults(result, overloadResult)
    }
    return result
  },
}

export const defnsSpecialExpression: BuiltinSpecialExpression<LitsFunction | null> = {
  parse: createParser(`defns`),
  evaluate: createEvaluator(`defns`),
  analyze: (node, contextStack, { analyzeAst }) => {
    castDefnsExpressionNode(node)
    const result: AnalyzeResult = { undefinedSymbols: new Set() }

    for (const overload of node.overloads) {
      const newContext: Context = {}
      overload.arguments.mandatoryArguments.forEach(arg => {
        newContext[arg] = { value: true }
      })
      if (typeof overload.arguments.restArgument === `string`) {
        newContext[overload.arguments.restArgument] = { value: true }
      }
      const newContextStack = contextStack.withContext(newContext)
      const overloadResult = analyzeAst(overload.body, newContextStack)
      addAnalyzeResults(result, overloadResult)
    }
    return result
  },
}

export const fnSpecialExpression: BuiltinSpecialExpression<LitsFunction | null> = {
  parse: createParser(`fn`),
  evaluate: createEvaluator(`fn`),
  analyze: (node, contextStack, { analyzeAst }) => {
    castFnExpressionNode(node)
    const result: AnalyzeResult = { undefinedSymbols: new Set() }

    for (const overload of node.overloads) {
      const newContext: Context = {}
      overload.arguments.mandatoryArguments.forEach(arg => {
        newContext[arg] = { value: true }
      })
      if (typeof overload.arguments.restArgument === `string`) {
        newContext[overload.arguments.restArgument] = { value: true }
      }
      const newContextStack = contextStack.withContext(newContext)
      const overloadResult = analyzeAst(overload.body, newContextStack)
      addAnalyzeResults(result, overloadResult)
    }
    return result
  },
}

function castExpressionNode(
  _node: SpecialExpressionNode,
): asserts _node is DefnSpecialExpressionNode | DefnsSpecialExpressionNode | FnSpecialExpressionNode {
  return
}

function castDefnExpressionNode(_node: SpecialExpressionNode): asserts _node is DefnSpecialExpressionNode {
  return
}

function castDefnsExpressionNode(_node: SpecialExpressionNode): asserts _node is DefnsSpecialExpressionNode {
  return
}

function castFnExpressionNode(_node: SpecialExpressionNode): asserts _node is FnSpecialExpressionNode {
  return
}

function arityOk(overloadedFunctions: FunctionOverload[], arity: Arity) {
  if (typeof arity === `number`) {
    return overloadedFunctions.every(fun => {
      if (typeof fun.arity === `number`) {
        return fun.arity !== arity
      }
      return fun.arity.min > arity
    })
  }
  return overloadedFunctions.every(fun => {
    if (typeof fun.arity === `number`) {
      return fun.arity < arity.min
    }
    return false
  })
}

function parseFunctionBody(tokens: Token[], position: number, { parseToken }: ParserHelpers): [number, AstNode[]] {
  let tkn = token.as(tokens[position], `EOF`)
  const body: AstNode[] = []
  while (!(tkn.type === `paren` && tkn.value === `)`)) {
    let bodyNode: AstNode
    ;[position, bodyNode] = parseToken(tokens, position)
    body.push(bodyNode)
    tkn = token.as(tokens[position], `EOF`)
  }
  if (body.length === 0) {
    throw new LitsError(`Missing body in function`, tkn.debugInfo)
  }
  return [position + 1, body]
}

function parseFunctionOverloades(
  tokens: Token[],
  position: number,
  parsers: ParserHelpers,
): [number, FunctionOverload[]] {
  let tkn = token.as(tokens[position], `EOF`, { type: `paren` })
  if (tkn.value === `(`) {
    const functionOverloades: FunctionOverload[] = []
    while (!(tkn.type === `paren` && tkn.value === `)`)) {
      position += 1
      tkn = token.as(tokens[position], `EOF`)
      let functionArguments: FunctionArguments
      ;[position, functionArguments] = parseFunctionArguments(tokens, position, parsers)
      const arity: Arity = functionArguments.restArgument
        ? { min: functionArguments.mandatoryArguments.length }
        : functionArguments.mandatoryArguments.length

      if (!arityOk(functionOverloades, arity)) {
        throw new LitsError(`All overloaded functions must have different arity`, tkn.debugInfo)
      }

      let functionBody: AstNode[]
      ;[position, functionBody] = parseFunctionBody(tokens, position, parsers)
      functionOverloades.push({
        arguments: functionArguments,
        body: functionBody,
        arity,
      })

      tkn = token.as(tokens[position], `EOF`, { type: `paren` })
      if (tkn.value !== `)` && tkn.value !== `(`) {
        throw new LitsError(`Expected ( or ) token, got ${valueToString(tkn)}.`, tkn.debugInfo)
      }
    }

    return [position + 1, functionOverloades]
  } else if (tkn.value === `[`) {
    let functionArguments: FunctionArguments
    ;[position, functionArguments] = parseFunctionArguments(tokens, position, parsers)
    const arity: Arity = functionArguments.restArgument
      ? { min: functionArguments.mandatoryArguments.length }
      : functionArguments.mandatoryArguments.length
    let functionBody: AstNode[]
    ;[position, functionBody] = parseFunctionBody(tokens, position, parsers)
    return [
      position,
      [
        {
          arguments: functionArguments,
          body: functionBody,
          arity,
        },
      ],
    ]
  } else {
    throw new LitsError(`Expected [ or ( token, got ${valueToString(tkn)}`, tkn.debugInfo)
  }
}

function parseFunctionArguments(
  tokens: Token[],
  position: number,
  parsers: ParserHelpers,
): [number, FunctionArguments] {
  const { parseArgument } = parsers

  let restArgument: string | undefined = undefined
  const mandatoryArguments: string[] = []
  let state: `mandatory` | `rest` = `mandatory`
  let tkn = token.as(tokens[position], `EOF`)

  position += 1
  tkn = token.as(tokens[position], `EOF`)
  while (!(tkn.type === `paren` && tkn.value === `]`)) {
    const [newPosition, node] = parseArgument(tokens, position)
    position = newPosition
    tkn = token.as(tokens[position], `EOF`)

    if (node.type === `Modifier`) {
      switch (node.value) {
        case `&`:
          if (state === `rest`) {
            throw new LitsError(`& can only appear once`, tkn.debugInfo)
          }
          state = `rest`
          break
        default:
          throw new LitsError(`Illegal modifier: ${node.value}`, tkn.debugInfo)
      }
    } else {
      switch (state) {
        case `mandatory`:
          mandatoryArguments.push(node.name)
          break
        case `rest`:
          if (restArgument !== undefined) {
            throw new LitsError(`Can only specify one rest argument`, tkn.debugInfo)
          }
          restArgument = node.name
          break
      }
    }
  }

  if (state === `rest` && restArgument === undefined) {
    throw new LitsError(`Missing rest argument name`, tkn.debugInfo)
  }

  position += 1

  const args: FunctionArguments = {
    mandatoryArguments,
    restArgument,
  }

  return [position, args]
}
