import { SourceCodeInfo } from './interface'

export class SourceCodeInfoImpl implements SourceCodeInfo {
  public line: number
  public column: number
  public code: string

  constructor(line: number, column: number, code: string) {
    this.line = line
    this.column = column
    this.code = code
  }

  public get codeMarker(): string {
    return `${` `.repeat(this.column - 1)}^`
  }

  public toString(): string {
    return `${this.code}\n${this.codeMarker}`
  }
}
