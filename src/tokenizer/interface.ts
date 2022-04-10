export type TokenizerType =
  | `paren`
  | `number`
  | `name`
  | `string`
  | `reservedName`
  | `modifier`
  | `regexpShorthand`
  | `fnShorthand`

export type SourceCodeInfo = {
  line: number
  column: number
  code: string
  codeMarker: string
  toString(): string
}

export type DebugInfo = SourceCodeInfo | `EOF` | null

export type Token = {
  type: TokenizerType
  value: string
  options?: Record<string, boolean>
  debugInfo: DebugInfo
}
export type TokenDescriptor = [length: number, token: Token | undefined]
export type Tokenizer = (input: string, position: number, debugInfo: DebugInfo) => TokenDescriptor
