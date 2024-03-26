import type { LocationGetter } from '../Lits/Lits'
import type { TokenType } from '../constants/constants'

export type SourceCodeInfo = {
  line?: number
  column?: number
  code: string
  filePath?: string
  getLocation?: LocationGetter
}

export type DebugInfo = SourceCodeInfo

export type Token = {
  t: TokenType // type
  v: string // value
  o?: Record<string, boolean> // options
  d?: DebugInfo // debugInfo
}
export type TokenDescriptor = [length: number, token: Token | undefined]
export type Tokenizer = (input: string, position: number, debugInfo?: DebugInfo) => TokenDescriptor
export type TokenStream = {
  tokens: Token[]
  filePath?: string
}

export type TokenizeParams = {
  debug: boolean
  filePath?: string
}
