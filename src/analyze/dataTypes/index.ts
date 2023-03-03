import { builtin } from '../../builtin'
import { ContextStack } from '../../ContextStack'
import { UndefinedSymbolError } from '../../errors'
import {
  AstNode,
  NameNode,
  NormalExpressionNode,
  NormalExpressionNodeWithName,
  SpecialExpressionNode,
} from '../../parser/interface'
import { normalExpressionNodeWithName } from '../../utils/assertion'
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

function lookupNameType(nameNode: NameNode, contextStack: ContextStack<DataType>): DataType {
  const key = nameNode.value

  for (const context of contextStack.stack) {
    const type = context[key]
    if (type) {
      return type as unknown as DataType
    }
  }
  return DataType.unknown
}

function calculateDataTypesOnAstNode(astNode: AstNode, contextStack: ContextStack<DataType>): DataType {
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
      return calculateDataTypesOnNormalExpression(astNode, contextStack)
    case `SpecialExpression`:
      return calculateDataTypesOnSpecialExpression(astNode, contextStack)
  }
  return DataType.nil
}

function calculateDataTypesOnSpecialExpression(
  _node: SpecialExpressionNode,
  _contextStack: ContextStack<DataType>,
): DataType {
  return DataType.unknown
  //const specialExpression = asValue(builtin.specialExpressions[node.name], node.token?.debugInfo)
  // return specialExpression?.getDataType(node, contextStack, { evaluateAstNode, builtin, lookUp })
}

function calculateDataTypesOnNormalExpression(
  node: NormalExpressionNode,
  contextStack: ContextStack<DataType>,
): DataType {
  const paramTypes = node.params.map(paramNode => calculateDataTypesOnAstNode(paramNode, contextStack))
  if (normalExpressionNodeWithName.is(node)) {
    for (const context of contextStack.stack) {
      const fn = context[node.name]?.value
      if (fn === undefined) {
        continue
      }
      return DataType.unknown
    }

    return calculateDataTypesOnBuiltinNormalExpression(node, paramTypes, contextStack)
  } else {
    return DataType.unknown
  }
  return DataType.nil
}

function calculateDataTypesOnBuiltinNormalExpression(
  node: NormalExpressionNodeWithName,
  params: DataType[],
  contextStack: ContextStack<DataType>,
): DataType {
  const normalExpression = builtin.normalExpressions[node.name]
  if (!normalExpression) {
    throw new UndefinedSymbolError(node.name, node.token?.debugInfo)
  }

  return normalExpression.getDataType?.({ params, contextStack, getDataType }) ?? DataType.unknown
}
