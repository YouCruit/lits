import { LocationGetter } from '../Lits/Lits'

export enum TokenizerType {
  Bracket = 0,
  Number = 1,
  Name = 2,
  String = 3,
  ReservedName = 4,
  Modifier = 5,
  RegexpShorthand = 6,
  FnShorthand = 7,
  CollectionAccessor = 8,
}

export function isTokenType(type: unknown): type is TokenizerType {
  return typeof type === `number` && Number.isInteger(type) && type >= 0 && type <= 8
}

export type SourceCodeInfo = {
  line: number
  column: number
  code: string
  getLocation?: LocationGetter
}

export type DebugInfo = SourceCodeInfo | `EOF`

export type Token = {
  t: TokenizerType // type
  v: string // value
  o?: Record<string, boolean> // options
  d?: DebugInfo // debugInfo
}
export type TokenDescriptor = [length: number, token: Token | undefined]
export type Tokenizer = (input: string, position: number, debugInfo?: DebugInfo) => TokenDescriptor

export type TokenizeParams = {
  debug: boolean
  getLocation?: LocationGetter
}
