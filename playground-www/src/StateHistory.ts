export interface HistoryStatus {
  canUndo: boolean
  canRedo: boolean
}

export class StateHistory {
  private history: string[] = []
  private index: number
  private listener: (status: HistoryStatus) => void
  private lastStatus: HistoryStatus = { canUndo: false, canRedo: false }
  constructor(initialState: string, listener: (status: HistoryStatus) => void) {
    this.history.push(initialState)
    this.index = 0
    this.listener = listener
  }

  private canUndo() {
    return this.index > 0
  }

  private canRedo() {
    return this.index < this.history.length - 1
  }

  push(state: string) {
    if (state !== this.history[this.index]) {
      this.history.splice(this.index + 1)
      this.history.push(state)
      this.index = this.history.length - 1
      this.notify()
    }
  }

  replace(state: string) {
    this.history[this.index] = state
    this.notify()
  }

  undo(): string {
    if (!this.canUndo())
      throw new Error('Cannot undo')
    this.index -= 1
    this.notify()
    return this.history[this.index]!
  }

  redo(): string {
    if (!this.canRedo())
      throw new Error('Cannot redo')
    this.index += 1
    this.notify()
    return this.history[this.index]!
  }

  peek(): string {
    return this.history[this.index]!
  }

  reset(initialState: string) {
    this.history = [initialState]
    this.index = 0
    this.notify()
  }

  notify() {
    const status = { canUndo: this.canUndo(), canRedo: this.canRedo() }
    if (status.canUndo !== this.lastStatus.canUndo || status.canRedo !== this.lastStatus.canRedo) {
      this.lastStatus = status
      setTimeout(() => this.listener(status), 0)
    }
  }
}
