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

  public inline(inline = true) {
    return new UnparseOptions(this.unparse, this.lineLength, this.col, inline, this.locked)
  }

  public lock() {
    return new UnparseOptions(this.unparse, this.lineLength, this.col, this.inlined, true)
  }
}
