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
    const leftPadding = ` `.repeat(this.column - 1)
    const rightPadding = ` `.repeat(this.code.length - this.column)
    return `${leftPadding}^${rightPadding}`
  }

  public toString(): string {
    return `${this.code}\n${this.codeMarker}`
  }
}
