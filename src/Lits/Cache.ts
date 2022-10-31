import { Ast } from '../parser/interface'
import { toNonNegativeInteger } from '../utils'
import { valueToString } from '../utils/helpers'

type CacheEntry = {
  key: string
  value: Ast
  nextEntry: CacheEntry | undefined
}

export class Cache {
  private cache: Record<string, CacheEntry> = {}
  private firstEntry: CacheEntry | undefined = undefined
  private lastEntry: CacheEntry | undefined = undefined
  private _size = 0
  private maxSize: number
  constructor(maxSize: number) {
    this.maxSize = toNonNegativeInteger(maxSize)
    if (this.maxSize < 1) {
      throw Error(`1 is the minimum maxSize, got ${valueToString(maxSize)}`)
    }
  }

  public getContent(): Record<string, Ast> {
    return Object.entries(this.cache).reduce((result: Record<string, Ast>, [key, entry]) => {
      result[key] = entry.value
      return result
    }, {})
  }

  public get size(): number {
    return this._size
  }

  public get(key: string): Ast | undefined {
    return this.cache[key]?.value
  }

  public clear(): void {
    this.cache = {}
    this.firstEntry = undefined
    this.lastEntry = undefined
    this._size = 0
  }

  public has(key: string): boolean {
    return !!this.cache[key]
  }

  public set(key: string, value: Ast): void {
    if (this.has(key)) {
      throw Error(`AstCache - key already present: ${key}`)
    }
    const newEntry: CacheEntry = { value, nextEntry: undefined, key }

    this.cache[key] = newEntry
    this._size += 1

    if (this.lastEntry) {
      this.lastEntry.nextEntry = newEntry
    }
    this.lastEntry = newEntry

    if (!this.firstEntry) {
      this.firstEntry = this.lastEntry
    }

    while (this.size > this.maxSize) {
      this.dropFirstEntry()
    }
  }

  private dropFirstEntry(): void {
    const firstEntry = this.firstEntry as CacheEntry
    delete this.cache[firstEntry.key]
    this._size -= 1
    this.firstEntry = firstEntry.nextEntry
  }
}
