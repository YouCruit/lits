import { SpecialExpressionName } from '../builtin/interface'
import { Condition } from '../builtin/specialExpressions/cond'
import { LoopBindingNode } from '../builtin/specialExpressions/loops'
import { Arity, FunctionOverload } from '../builtin/utils'
import { Context } from '../evaluator/interface'
import { Any, Arr } from '../interface'
import { ReservedName } from '../reservedNames'
import { DebugInfo, Token } from '../tokenizer/interface'

export const FUNCTION_SYMBOL = `_LF_`
export const REGEXP_SYMBOL = `_RE_`

export type EvaluatedFunctionArguments = {
  mandatoryArguments: string[]
  restArgument?: string
}

export enum FunctionType {
  UserDefined = 0,
  Partial = 1,
  Comp = 2,
  Constantly = 3,
  Juxt = 4,
  Complement = 5,
  EveryPred = 6,
  SomePred = 7,
  Fnil = 8,
  Builtin = 9,
}

export type EvaluatedFunctionOverload = {
  as: EvaluatedFunctionArguments
  b: AstNode[]
  a: Arity
  f: Context
}

type GenericLitsFunction = {
  [FUNCTION_SYMBOL]: true
  d?: DebugInfo
  t: FunctionType
}

export interface RegularExpression {
  [REGEXP_SYMBOL]: true
  d?: DebugInfo
  s: string
  f: string
}

export interface UserDefinedFunction extends GenericLitsFunction {
  t: FunctionType.UserDefined
  n: string | undefined // name
  o: EvaluatedFunctionOverload[]
}

export interface PartialFunction extends GenericLitsFunction {
  t: FunctionType.Partial
  f: Any
  p: Arr
}

export interface CompFunction extends GenericLitsFunction {
  t: FunctionType.Comp
  f: Arr
}

export interface ConstantlyFunction extends GenericLitsFunction {
  t: FunctionType.Constantly
  v: Any
}

export interface JuxtFunction extends GenericLitsFunction {
  t: FunctionType.Juxt
  f: Arr
}

export interface ComplementFunction extends GenericLitsFunction {
  t: FunctionType.Complement
  f: Any
}

export interface EveryPredFunction extends GenericLitsFunction {
  t: FunctionType.EveryPred
  f: Arr
}

export interface SomePredFunction extends GenericLitsFunction {
  t: FunctionType.SomePred
  f: Arr
}

export interface FNilFunction extends GenericLitsFunction {
  t: FunctionType.Fnil
  f: Any
  p: Arr
}

export interface BuiltinFunction extends GenericLitsFunction {
  t: FunctionType.Builtin
  n: string // name
}

export type LitsFunction =
  | UserDefinedFunction
  | BuiltinFunction
  | PartialFunction
  | CompFunction
  | ConstantlyFunction
  | JuxtFunction
  | ComplementFunction
  | EveryPredFunction
  | SomePredFunction
  | FNilFunction

export type LitsFunctionType = LitsFunction[`t`]

export enum AstNodeType {
  Number = 0,
  String = 1,
  NormalExpression = 2,
  SpecialExpression = 3,
  Name = 4,
  Modifier = 5,
  ReservedName = 6,
  Binding = 7,
  Argument = 8,
  Partial = 9,
}

export function isAstNodeType(type: unknown): type is AstNodeType {
  return typeof type === `number` && Number.isInteger(type) && type >= 0 && type <= 9
}

export type ModifierName = `&` | `&let` | `&when` | `&while`

interface GenericNode {
  t: AstNodeType // type
  tkn?: Token
}

export type ExpressionNode = NormalExpressionNode | SpecialExpressionNode | NumberNode | StringNode
export type ParseBinding = (tokens: Token[], position: number) => [number, BindingNode]
export type ParseBindings = (tokens: Token[], position: number) => [number, BindingNode[]]
export type ParseArgument = (tokens: Token[], position: number) => [number, ArgumentNode | ModifierNode]
export type ParseExpression = (tokens: Token[], position: number) => [number, ExpressionNode]
export type ParseNormalExpression = (tokens: Token[], position: number) => [number, NormalExpressionNode]
export type ParseSpecialExpression = (tokens: Token[], position: number) => [number, SpecialExpressionNode]
export type ParseTokens = (tokens: Token[], position: number) => [number, AstNode[]]
export type ParseToken = (tokens: Token[], position: number) => [number, AstNode]

export interface NumberNode extends GenericNode {
  t: AstNodeType.Number // type
  v: number // value
}
export interface StringNode extends GenericNode {
  t: AstNodeType.String // type
  v: string // value
}
export interface NameNode extends GenericNode {
  t: AstNodeType.Name // type
  v: string // value
}
export interface ModifierNode extends GenericNode {
  t: AstNodeType.Modifier // type
  v: ModifierName
}
export interface ReservedNameNode extends GenericNode {
  t: AstNodeType.ReservedName // type
  v: ReservedName // reservedName
}

interface NormalExpressionNodeBase extends GenericNode {
  t: AstNodeType.NormalExpression // type
  p: AstNode[] // params
}

export interface NormalExpressionNodeWithName extends NormalExpressionNodeBase {
  n: string // name
  e?: ExpressionNode // expressionNode
}

interface NormalExpressionNodeExpression extends NormalExpressionNodeBase {
  n?: never // name
  e: ExpressionNode // expressionNode
}

export type NormalExpressionNode = NormalExpressionNodeWithName | NormalExpressionNodeExpression

export interface BindingNode extends GenericNode {
  t: AstNodeType.Binding // type
  n: string // name
  v: AstNode // value
}

export interface ArgumentNode extends GenericNode {
  t: AstNodeType.Argument // type
  n: string // name
  d?: AstNode // defaultValue
}

export interface SpecialExpressionNode extends GenericNode {
  t: AstNodeType.SpecialExpression // type
  n: SpecialExpressionName // name
  p: AstNode[] // params
  b?: BindingNode // binding
  bs?: BindingNode[] // bindings
  c?: Condition[] // conditions
  f?: AstNode // functionName
  o?: FunctionOverload[] // overloads
  l?: LoopBindingNode[] // loopBindings
  m?: AstNode // messageNode
  te?: AstNode // tryExpression
  e?: NameNode // error
  ce?: AstNode // catchExpression
}

export type AstNode =
  | NumberNode
  | StringNode
  | ReservedNameNode
  | NameNode
  | NormalExpressionNode
  | ModifierNode
  | SpecialExpressionNode

type AstBody = AstNode[]
export type Ast = {
  b: AstBody // body
}
