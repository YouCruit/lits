import { ContextStack } from '../../ContextStack'
import { AstNode, NameNode } from '../../parser/interface'
import { DataType } from './DataType'
import { GetDataType } from './interface'

export const getDataType: GetDataType = (astNode, contextStack) => {
  const astNodes = Array.isArray(astNode) ? astNode : [astNode]

  let result = DataType.nil
  for (const node of astNodes) {
    result = calculateDataTypesOnAstNode(node, contextStack)
  }

  return result
}

function lookupNameType(nameNode: NameNode, contextStack: ContextStack): DataType {
  const key = nameNode.value

  for (const context of contextStack.stack) {
    const type = context[key]
    if (type) {
      return type as unknown as DataType
    }
  }
  return DataType.unknown
}

function calculateDataTypesOnAstNode(astNode: AstNode, contextStack: ContextStack): DataType {
  switch (astNode.type) {
    case `Name`: {
      return lookupNameType(astNode, contextStack)
    }
    case `String`:
      return DataType.string
    case `Number`:
      return DataType.number
    case `Modifier`:
      throw Error(`Should not come here`)
    case `ReservedName`:
      switch (astNode.value) {
        case `false`:
          return DataType.boolean
        case `true`:
          return DataType.boolean
        default:
          return DataType.nil
      }
    case `NormalExpression`:
    case `SpecialExpression`:
  }
  return DataType.nil
}
