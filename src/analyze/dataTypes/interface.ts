import { AstNode } from '../../parser/interface'
import { DataType } from './DataType'

export type GetDataTypes = (astNode: AstNode | AstNode[]) => DataType
