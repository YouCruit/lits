import { builtin } from '../../builtin'
import { ContextStack } from '../../ContextStack'
import {
  AstNode,
  NameNode,
  NormalExpressionNode,
  NormalExpressionNodeWithName,
  SpecialExpressionNode,
} from '../../parser/interface'
import { asValue, normalExpressionNodeWithName } from '../../utils/assertion'
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
      return type.value
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
      return astNode.value.length > 0 ? DataType.nonEmptyString : DataType.emptyString
    case `Number`: {
      if (astNode.value === 0) {
        return DataType.zero
      }
      const integer = Number.isInteger(astNode.value)
      const positive = astNode.value > 0
      if (integer) {
        return positive ? DataType.positiveInteger : DataType.negativeInteger
      } else {
        return positive ? DataType.positiveNonInteger : DataType.negativeNonInteger
      }
    }

    case `Modifier`:
      throw Error(`Should not come here`)
    case `ReservedName`:
      switch (astNode.value) {
        case `true`:
          return DataType.true
        case `false`:
          return DataType.false
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
  node: SpecialExpressionNode,
  contextStack: ContextStack<DataType>,
): DataType {
  const specialExpression = asValue(builtin.specialExpressions[node.name], node.token?.debugInfo)

  return specialExpression?.getDataType?.(node, contextStack, { getDataType, builtin }) ?? DataType.unknown
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
      return asValue(fn.fnReturnType)
    }

    return calculateDataTypesOnBuiltinNormalExpression(node, paramTypes)
  } else {
    return DataType.unknown
  }
}

function calculateDataTypesOnBuiltinNormalExpression(node: NormalExpressionNodeWithName, params: DataType[]): DataType {
  const normalExpression = builtin.normalExpressions[node.name]
  if (!normalExpression) {
    return DataType.unknown
  }

  return normalExpression.getDataType?.({ params, getDataType: getDataType }) ?? DataType.unknown
}
