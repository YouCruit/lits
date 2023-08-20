import { Token, TokenizerType } from '../tokenizer/interface'
import {
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
import { ReservedName } from '../reservedNames'
import { LitsError } from '../errors'
import { FnNode } from '../builtin/specialExpressions/functions'
import { FunctionArguments } from '../builtin/utils'
import {
  assertEventNumberOfParams,
  assertUnreachable,
  assertValue,
  asValue,
  expressionNode,
  nameNode,
  token,
} from '../utils/assertion'
import { valueToString } from '../utils/helpers'
import { AstNodeType } from './AstNodeType'

type ParseNumber = (tokens: Token[], position: number) => [number, NumberNode]
export const parseNumber: ParseNumber = (tokens: Token[], position: number) => {
  const tkn = token.as(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.Number, v: Number(tkn.v), tkn: tkn.d ? tkn : undefined }]
}

type ParseString = (tokens: Token[], position: number) => [number, StringNode]
export const parseString: ParseString = (tokens: Token[], position: number) => {
  const tkn = token.as(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.String, v: tkn.v, tkn: tkn.d ? tkn : undefined }]
}

type ParseName = (tokens: Token[], position: number) => [number, NameNode]
export const parseName: ParseName = (tokens: Token[], position: number) => {
  const tkn = token.as(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.Name, v: tkn.v, tkn: tkn.d ? tkn : undefined }]
}

type ParseReservedName = (tokens: Token[], position: number) => [number, ReservedNameNode]
export const parseReservedName: ParseReservedName = (tokens: Token[], position: number) => {
  const tkn = token.as(tokens[position], `EOF`)
  return [position + 1, { t: AstNodeType.ReservedName, v: tkn.v as ReservedName, tkn: tkn.d ? tkn : undefined }]
}

const parseTokens: ParseTokens = (tokens, position) => {
  let tkn = token.as(tokens[position], `EOF`)
  const astNodes: AstNode[] = []
  let astNode: AstNode
  while (!(tkn.t === TokenizerType.Bracket && (tkn.v === `)` || tkn.v === `]`))) {
    ;[position, astNode] = parseToken(tokens, position)
    astNodes.push(astNode)
    tkn = token.as(tokens[position], `EOF`)
  }
  return [position, astNodes]
}

const parseExpression: ParseExpression = (tokens, position) => {
  position += 1 // Skip parenthesis

  const tkn = token.as(tokens[position], `EOF`)
  if (tkn.t === TokenizerType.Name && builtin.specialExpressions[tkn.v]) {
    return parseSpecialExpression(tokens, position)
  }
  return parseNormalExpression(tokens, position)
}

type ParseArrayLitteral = (tokens: Token[], position: number) => [number, AstNode]
const parseArrayLitteral: ParseArrayLitteral = (tokens, position) => {
  const firstToken = token.as(tokens[position], `EOF`)
  position = position + 1

  let tkn = token.as(tokens[position], `EOF`)
  const params: AstNode[] = []
  let param: AstNode
  while (!(tkn.t === TokenizerType.Bracket && tkn.v === `]`)) {
    ;[position, param] = parseToken(tokens, position)
    params.push(param)
    tkn = token.as(tokens[position], `EOF`)
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
  const firstToken = token.as(tokens[position], `EOF`)
  position = position + 1

  let tkn = token.as(tokens[position], `EOF`)
  const params: AstNode[] = []
  let param: AstNode
  while (!(tkn.t === TokenizerType.Bracket && tkn.v === `}`)) {
    ;[position, param] = parseToken(tokens, position)
    params.push(param)
    tkn = token.as(tokens[position], `EOF`)
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
  const tkn = token.as(tokens[position], `EOF`)
  const stringNode: StringNode = {
    t: AstNodeType.String,
    v: tkn.v,
    tkn: tkn.d ? tkn : undefined,
  }

  assertValue(tkn.o, tkn.d)

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
  const firstToken = token.as(tokens[position], `EOF`)

  position += 1
  const [newPosition, expressionNode] = parseExpression(tokens, position)

  let arity = 0
  for (let pos = position + 1; pos < newPosition - 1; pos += 1) {
    const tkn = token.as(tokens[pos], `EOF`)
    if (tkn.t === TokenizerType.Name) {
      const match = placeholderRegexp.exec(tkn.v)
      if (match) {
        arity = Math.max(arity, Number(match[1]))
        if (arity > 20) {
          throw new LitsError(`Can't specify more than 20 arguments`, firstToken.d)
        }
      }
    }
    if (tkn.t === TokenizerType.FnShorthand) {
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
        b: [expressionNode],
        a: args.m.length,
      },
    ],
    tkn: firstToken.d ? firstToken : undefined,
  }

  return [newPosition, node]
}

const parseArgument: ParseArgument = (tokens, position) => {
  const tkn = token.as(tokens[position], `EOF`)
  if (tkn.t === TokenizerType.Name) {
    return [position + 1, { t: AstNodeType.Argument, n: tkn.v, tkn }]
  } else if (tkn.t === TokenizerType.Modifier) {
    const value = tkn.v as ModifierName
    return [position + 1, { t: AstNodeType.Modifier, v: value, tkn: tkn.d ? tkn : undefined }]
  } else {
    throw new LitsError(`Expected name or modifier token, got ${valueToString(tkn)}.`, tkn.d)
  }
}

const parseBindings: ParseBindings = (tokens, position) => {
  let tkn = token.as(tokens[position], `EOF`, { type: TokenizerType.Bracket, value: `[` })
  position += 1
  tkn = token.as(tokens[position], `EOF`)
  const bindings: BindingNode[] = []
  let binding: BindingNode
  while (!(tkn.t === TokenizerType.Bracket && tkn.v === `]`)) {
    ;[position, binding] = parseBinding(tokens, position)
    bindings.push(binding)
    tkn = token.as(tokens[position], `EOF`)
  }
  position += 1

  return [position, bindings]
}

const parseBinding: ParseBinding = (tokens, position) => {
  const firstToken = token.as(tokens[position], `EOF`, { type: TokenizerType.Name })
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

  if (expressionNode.is(fnNode)) {
    const node: NormalExpressionNode = {
      t: AstNodeType.NormalExpression,
      e: fnNode,
      p: params,
      tkn: fnNode.tkn,
    }

    return [position, node]
  }

  nameNode.assert(fnNode, fnNode.tkn?.d)
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
  const { v: expressionName, d: debugInfo } = token.as(tokens[position], `EOF`)
  position += 1

  const { parse, validate } = asValue(builtin.specialExpressions[expressionName], debugInfo)

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
  const tkn = token.as(tokens[position], `EOF`)
  switch (tkn.t) {
    case TokenizerType.Number:
      return parseNumber(tokens, position)
    case TokenizerType.String:
      return parseString(tokens, position)
    case TokenizerType.Name:
      return parseName(tokens, position)
    case TokenizerType.ReservedName:
      return parseReservedName(tokens, position)
    case TokenizerType.Bracket:
      if (tkn.v === `(`) {
        return parseExpression(tokens, position)
      } else if (tkn.v === `[`) {
        return parseArrayLitteral(tokens, position)
      } else if (tkn.v === `{`) {
        return parseObjectLitteral(tokens, position)
      }
      break
    case TokenizerType.RegexpShorthand:
      return parseRegexpShorthand(tokens, position)
    case TokenizerType.FnShorthand:
      return parseFnShorthand(tokens, position)
    case TokenizerType.CollectionAccessor:
    case TokenizerType.Modifier:
      break
    /* istanbul ignore next */
    default:
      assertUnreachable(tkn.t)
  }
  throw new LitsError(`Unrecognized token: ${tkn.t} value=${tkn.v}`, tkn.d)
}
