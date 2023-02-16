import { ContextStack } from '../../ContextStack'
import { AstNode } from '../../parser/interface'
import { DataType } from './DataType'

export type GetDataType = (astNode: AstNode | AstNode[], contextStack: ContextStack) => DataType
