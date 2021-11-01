export type TokenizerType =
  | `paren`
  | `number`
  | `name`
  | `string`
  | `reservedName`
  | `modifier`
  | `regexpShorthand`
  | `fnShorthand`

export type TokenMeta =
  | {
      line: number
      column: number
      toString(): string
    }
  | `EOF`

export type Token = {
  type: TokenizerType
  value: string
  options?: Record<string, boolean>
  meta: TokenMeta
}
export type TokenDescriptor = [length: number, token: Token | undefined]
export type Tokenizer = (input: string, position: number, meta: TokenMeta) => TokenDescriptor
