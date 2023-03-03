import { ContextStack } from '../../ContextStack'
import { Any, Arr } from '../../interface'
import { AstNode } from '../../parser/interface'
import { DebugInfo } from '../../tokenizer/interface'
import { DataType } from './DataType'

export type GetDataType = (astNode: AstNode | AstNode[], contextStack: ContextStack<DataType>) => DataType

export type CalculateDataTypesOnFunction = (
  fn: Any,
  params: Arr,
  contextStack: ContextStack<DataType>,
  debugInfo?: DebugInfo,
) => DataType
