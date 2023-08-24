import type { LitsFunction } from '.'
import type { RegularExpression } from './parser/interface'

export type Arr = unknown[]
export type Seq = string | Arr
export type Obj = Record<string, unknown>
export type Coll = Seq | Obj
export type Any = Coll | string | number | boolean | null | LitsFunction | RegularExpression

export type UnknownRecord = Record<string, unknown>
