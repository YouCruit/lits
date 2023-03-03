import { DataType } from '../analyze/dataTypes/DataType'
import { Any } from '../interface'

export type ContextEntry<T extends Any | DataType = Any> = { value: T }
export type Context<T extends Any | DataType = Any> = Record<string, ContextEntry<T>>
