import { DataType } from '../analyze/dataTypes/DataType'
import { ContextEntry } from '../ContextStack/interface'
import { Any } from '../interface'
import { BuiltinFunction } from '../parser/interface'

export type LookUpResult<T extends Any | DataType = Any> = {
  contextEntry: ContextEntry<T> | null
  builtinFunction: BuiltinFunction | null
  specialExpression: true | null
}
