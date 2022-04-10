import { SourceCodeInfo } from './interface'

export class SourceCodeInfoImpl implements SourceCodeInfo {
  public line: number
  public column: number
  public code: string
  public filename?: string

  constructor(line: number, column: number, code: string, filename: string | undefined) {
    this.line = line
    this.column = column
    this.code = code
    this.filename = filename
  }

  public get codeMarker(): string {
    const leftPadding = this.column - 1
    const rightPadding = this.code.length - leftPadding - 1
    return `${` `.repeat(leftPadding)}^${` `.repeat(rightPadding)}`
  }

  public toString(): string {
    return `${this.code}\n${this.codeMarker}`
  }
}
