import type { Token } from '../tokenizer/interface'
import { TokenType } from '../constants/constants'
import type {
  AstNode,
  NormalExpressionNode,
  NameNode,
  NumberNode,
  StringNode,
  ReservedNameNode,
  ParseExpression,
  ParseTokens,
  ParseToken,
  ParseSpecialExpression,
  ParseNormalExpression,
  ParseArgument,
  BindingNode,
  ModifierName,
  ParseBindings,
  NormalExpressionNodeWithName,
  ParseBinding,
} from './interface'
import { builtin } from '../builtin'
import type { ReservedName } from '../reservedNames'
import { LitsError } from '../errors'
import type { FnNode } from '../builtin/specialExpressions/functions'
import type { FunctionArguments } from '../builtin/utils'
import { AstNodeType } from '../constants/constants'
import { assertNameNode, isExpressionNode } from '../typeGuards/astNode'
import { valueToString } from '../utils/debug/debugTools'
import { asToken } from '../typeGuards/token'
import { assertEventNumberOfParams, assertNonUndefined, asNonUndefined, assertUnreachable } from '../typeGuards'

type ParseNumber = (tokens: Token[], position: number) => [number, NumberNode]
export const parseNumber: ParseNumber = (tokens: Token[], position: number) => {
  const tkn = asToken(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.Number, v: Number(tkn.v), tkn: tkn.d ? tkn : undefined }]
}

type ParseString = (tokens: Token[], position: number) => [number, StringNode]
export const parseString: ParseString = (tokens: Token[], position: number) => {
  const tkn = asToken(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.String, v: tkn.v, tkn: tkn.d ? tkn : undefined }]
}

type ParseName = (tokens: Token[], position: number) => [number, NameNode]
export const parseName: ParseName = (tokens: Token[], position: number) => {
  const tkn = asToken(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.Name, v: tkn.v, tkn: tkn.d ? tkn : undefined }]
}

type ParseReservedName = (tokens: Token[], position: number) => [number, ReservedNameNode]
export const parseReservedName: ParseReservedName = (tokens: Token[], position: number) => {
  const tkn = asToken(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.ReservedName, v: tkn.v as ReservedName, tkn: tkn.d ? tkn : undefined }]
}

const parseTokens: ParseTokens = (tokens, position) => {
  let tkn = asToken(tokens[position], `EOF`)
  const astNodes: AstNode[] = []
  let astNode: AstNode
  while (!(tkn.t === TokenType.Bracket && (tkn.v === `)` || tkn.v === `]`))) {
    ;[position, astNode] = parseToken(tokens, position)
    astNodes.push(astNode)
    tkn = asToken(tokens[position], `EOF`)
  }
  return [position, astNodes]
}

const parseExpression: ParseExpression = (tokens, position) => {
  position += 1 // Skip parenthesis

  const tkn = asToken(tokens[position], `EOF`)
  if (tkn.t === TokenType.Name && builtin.specialExpressions[tkn.v]) {
    return parseSpecialExpression(tokens, position)
  }
  return parseNormalExpression(tokens, position)
}

type ParseArrayLitteral = (tokens: Token[], position: number) => [number, AstNode]
const parseArrayLitteral: ParseArrayLitteral = (tokens, position) => {
  const firstToken = asToken(tokens[position], `EOF`)
  position = position + 1

  let tkn = asToken(tokens[position], `EOF`)
  const params: AstNode[] = []
  let param: AstNode
  while (!(tkn.t === TokenType.Bracket && tkn.v === `]`)) {
    ;[position, param] = parseToken(tokens, position)
    params.push(param)
    tkn = asToken(tokens[position], `EOF`)
  }

  position = position + 1

  const node: NormalExpressionNode = {
    t: AstNodeType.NormalExpression,
    n: `array`,
    p: params,
    tkn: firstToken.d ? firstToken : undefined,
  }

  return [position, node]
}

type ParseObjectLitteral = (tokens: Token[], position: number) => [number, NormalExpressionNodeWithName]
const parseObjectLitteral: ParseObjectLitteral = (tokens, position) => {
  const firstToken = asToken(tokens[position], `EOF`)
  position = position + 1

  let tkn = asToken(tokens[position], `EOF`)
  const params: AstNode[] = []
  let param: AstNode
  while (!(tkn.t === TokenType.Bracket && tkn.v === `}`)) {
    ;[position, param] = parseToken(tokens, position)
    params.push(param)
    tkn = asToken(tokens[position], `EOF`)
  }

  position = position + 1

  const node: NormalExpressionNode = {
    t: AstNodeType.NormalExpression,
    n: `object`,
    p: params,
    tkn: firstToken.d ? firstToken : undefined,
  }

  assertEventNumberOfParams(node)

  return [position, node]
}

type ParseRegexpShorthand = (tokens: Token[], position: number) => [number, NormalExpressionNodeWithName]
const parseRegexpShorthand: ParseRegexpShorthand = (tokens, position) => {
  const tkn = asToken(tokens[position], `EOF`)
  const stringNode: StringNode = {
    t: AstNodeType.String,
    v: tkn.v,
    tkn: tkn.d ? tkn : undefined,
  }

  assertNonUndefined(tkn.o, tkn.d)

  const optionsNode: StringNode = {
    t: AstNodeType.String,
    v: `${tkn.o.g ? `g` : ``}${tkn.o.i ? `i` : ``}`,
    tkn: tkn.d ? tkn : undefined,
  }

  const node: NormalExpressionNode = {
    t: AstNodeType.NormalExpression,
    n: `regexp`,
    p: [stringNode, optionsNode],
    tkn: tkn.d ? tkn : undefined,
  }

  return [position + 1, node]
}

const placeholderRegexp = /^%([1-9][0-9]?$)/
type ParseFnShorthand = (tokens: Token[], position: number) => [number, FnNode]
const parseFnShorthand: ParseFnShorthand = (tokens, position) => {
  const firstToken = asToken(tokens[position], `EOF`)

  position += 1
  const [newPosition, exprNode] = parseExpression(tokens, position)

  let arity = 0
  for (let pos = position + 1; pos < newPosition - 1; pos += 1) {
    const tkn = asToken(tokens[pos], `EOF`)
    if (tkn.t === TokenType.Name) {
      const match = placeholderRegexp.exec(tkn.v)
      if (match) {
        arity = Math.max(arity, Number(match[1]))
        if (arity > 20) {
          throw new LitsError(`Can't specify more than 20 arguments`, firstToken.d)
        }
      }
    }
    if (tkn.t === TokenType.FnShorthand) {
      throw new LitsError(`Nested shortcut functions are not allowed`, firstToken.d)
    }
  }

  const mandatoryArguments: string[] = []

  for (let i = 1; i <= arity; i += 1) {
    mandatoryArguments.push(`%${i}`)
  }

  const args: FunctionArguments = {
    b: [],
    m: mandatoryArguments,
  }

  const node: FnNode = {
    t: AstNodeType.SpecialExpression,
    n: `fn`,
    p: [],
    o: [
      {
        as: args,
        b: [exprNode],
        a: args.m.length,
      },
    ],
    tkn: firstToken.d ? firstToken : undefined,
  }

  return [newPosition, node]
}

const parseArgument: ParseArgument = (tokens, position) => {
  const tkn = asToken(tokens[position], `EOF`)
  if (tkn.t === TokenType.Name) {
    return [position + 1, { t: AstNodeType.Argument, n: tkn.v, tkn }]
  } else if (tkn.t === TokenType.Modifier) {
    const value = tkn.v as ModifierName
    return [position + 1, { t: AstNodeType.Modifier, v: value, tkn: tkn.d ? tkn : undefined }]
  } else {
    throw new LitsError(`Expected name or modifier token, got ${valueToString(tkn)}.`, tkn.d)
  }
}

const parseBindings: ParseBindings = (tokens, position) => {
  let tkn = asToken(tokens[position], `EOF`, { type: TokenType.Bracket, value: `[` })
  position += 1
  tkn = asToken(tokens[position], `EOF`)
  const bindings: BindingNode[] = []
  let binding: BindingNode
  while (!(tkn.t === TokenType.Bracket && tkn.v === `]`)) {
    ;[position, binding] = parseBinding(tokens, position)
    bindings.push(binding)
    tkn = asToken(tokens[position], `EOF`)
  }
  position += 1

  return [position, bindings]
}

const parseBinding: ParseBinding = (tokens, position) => {
  const firstToken = asToken(tokens[position], `EOF`, { type: TokenType.Name })
  const name = firstToken.v

  position += 1
  let value: AstNode
  ;[position, value] = parseToken(tokens, position)

  const node: BindingNode = {
    t: AstNodeType.Binding,
    n: name,
    v: value,
    tkn: firstToken.d ? firstToken : undefined,
  }
  return [position, node]
}

const parseNormalExpression: ParseNormalExpression = (tokens, position) => {
  const [newPosition, fnNode] = parseToken(tokens, position)

  let params: AstNode[]
  ;[position, params] = parseTokens(tokens, newPosition)
  position += 1

  if (isExpressionNode(fnNode)) {
    const node: NormalExpressionNode = {
      t: AstNodeType.NormalExpression,
      e: fnNode,
      p: params,
      tkn: fnNode.tkn,
    }

    return [position, node]
  }

  assertNameNode(fnNode, fnNode.tkn?.d)
  const node: NormalExpressionNode = {
    t: AstNodeType.NormalExpression,
    n: fnNode.v,
    p: params,
    tkn: fnNode.tkn,
  }

  const builtinExpression = builtin.normalExpressions[node.n]

  if (builtinExpression) {
    builtinExpression.validate?.(node)
  }

  return [position, node]
}

const parseSpecialExpression: ParseSpecialExpression = (tokens, position) => {
  const { v: expressionName, d: debugInfo } = asToken(tokens[position], `EOF`)
  position += 1

  const { parse, validate } = asNonUndefined(builtin.specialExpressions[expressionName], debugInfo)

  const [positionAfterParse, node] = parse(tokens, position, {
    parseExpression,
    parseTokens,
    parseToken,
    parseBinding,
    parseBindings,
    parseArgument,
  })

  validate?.(node)

  return [positionAfterParse, node]
}

export const parseToken: ParseToken = (tokens, position) => {
  const tkn = asToken(tokens[position], `EOF`)
  switch (tkn.t) {
    case TokenType.Number:
      return parseNumber(tokens, position)
    case TokenType.String:
      return parseString(tokens, position)
    case TokenType.Name:
      return parseName(tokens, position)
    case TokenType.ReservedName:
      return parseReservedName(tokens, position)
    case TokenType.Bracket:
      if (tkn.v === `(`) {
        return parseExpression(tokens, position)
      } else if (tkn.v === `[`) {
        return parseArrayLitteral(tokens, position)
      } else if (tkn.v === `{`) {
        return parseObjectLitteral(tokens, position)
      }
      break
    case TokenType.RegexpShorthand:
      return parseRegexpShorthand(tokens, position)
    case TokenType.FnShorthand:
      return parseFnShorthand(tokens, position)
    case TokenType.CollectionAccessor:
    case TokenType.Modifier:
      break
    /* istanbul ignore next */
    default:
      assertUnreachable(tkn.t)
  }
  throw new LitsError(`Unrecognized token: ${tkn.t} value=${tkn.v}`, tkn.d)
}
