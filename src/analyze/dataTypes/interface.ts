import { AstNode } from '../../parser/interface'
import { DataType } from './DataType'

export type GetDataType = (astNode: AstNode | AstNode[], nameTypes: Array<Record<string, DataType>>) => DataType
