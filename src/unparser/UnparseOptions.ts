import type { Unparse } from './unparse'

export class UnparseOptions {
  public readonly indent: string
  constructor(
    public readonly unparse: Unparse,
    public readonly lineLength: number,
    public readonly col = 0,
    public readonly inlined = false,
    public readonly locked = false,
  ) {
    this.indent = ' '.repeat(col)
  }

  public inc(count = 1) {
    return new UnparseOptions(this.unparse, this.lineLength, this.col + count, this.inlined, this.locked)
  }

  public inline() {
    return new UnparseOptions(this.unparse, this.lineLength, this.col, true, this.locked)
  }

  public noInline() {
    return new UnparseOptions(this.unparse, this.lineLength, this.col, false, this.locked)
  }

  public lock() {
    return new UnparseOptions(this.unparse, this.lineLength, this.col, this.inlined, true)
  }

  public assertNotOverflown(value: string): string {
    if (value.split('\n').every((line, index) => {
      const length = (index === 0 && this.inlined) ? this.col + line.length : line.length

      return length <= this.lineLength
    }))
      return value

    throw new Error('Line length exceeded')
  }
}
