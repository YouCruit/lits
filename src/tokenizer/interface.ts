import type { TokenType } from '../constants/constants'

export type SourceCodeInfo = {
  position?: {
    line: number
    column: number
  }
  code?: string
  filePath?: string
}

export type Token = {
  t: TokenType // type
  v: string // value
  o?: Record<string, boolean> // options
  d?: SourceCodeInfo // sourceCodeInfo
}
export type TokenDescriptor = [length: number, token: Token | undefined]
export type Tokenizer = (input: string, position: number, sourceCodeInfo?: SourceCodeInfo) => TokenDescriptor
export type TokenStream = {
  tokens: Token[]
  filePath?: string
}

export type TokenizeParams = {
  debug: boolean
  filePath?: string
}
