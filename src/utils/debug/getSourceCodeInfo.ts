import type { SourceCodeInfo } from '../../tokenizer/interface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSourceCodeInfo(anyValue: any, sourceCodeInfo?: SourceCodeInfo): SourceCodeInfo | undefined {
  return anyValue?.sourceCodeInfo ?? sourceCodeInfo
}
