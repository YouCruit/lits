import { lookUp } from '../../evaluator'
import { AstNode } from '../../parser/interface'
import { asValue } from '../../utils/assertion'
import { DataType } from './DataType'
import { GetDataTypes } from './interface'

export const getDataType: GetDataTypes = astNode => {
  const astNodes = Array.isArray(astNode) ? astNode : [astNode]

  const node = astNodes.length > 0 ? astNodes[astNodes.length - 1] : null

  if (!node) {
    return DataType.nil()
  }

  return calculateDataTypesOnAstNode(node)
}

function calculateDataTypesOnAstNode(astNode: AstNode): DataType {
  switch (astNode.type) {
    case `Name`: {
      const lookUpResult = lookUp(astNode, contextStack)
      if (!lookUpResult.builtinFunction && !lookUpResult.contextEntry && !lookUpResult.specialExpression) {
        return new Set([{ symbol: astNode.value, token: astNode.token }])
      }
      return emptySet
    }
    case `String`:
    case `Number`:
    case `Modifier`:
    case `ReservedName`:
      return emptySet
    case `NormalExpression`: {
      const undefinedSymbols = new Set<UndefinedSymbolEntry>()
      const { expression, name, token } = astNode
      if (typeof name === `string`) {
        const lookUpResult = lookUp({ type: `Name`, value: name, token }, contextStack)
        if (
          lookUpResult.builtinFunction === null &&
          lookUpResult.contextEntry === null &&
          lookUpResult.specialExpression === null
        ) {
          undefinedSymbols.add({ symbol: name, token: astNode.token })
        }
      }
      if (expression) {
        switch (expression.type) {
          case `String`:
          case `Number`:
            break
          case `NormalExpression`:
          case `SpecialExpression`: {
            const innerUndefinedSymbols = calculateUndefinedSymbolsOnAstNode(expression, contextStack, builtin)
            innerUndefinedSymbols.forEach(symbol => undefinedSymbols.add(symbol))
            break
          }
        }
      }

      for (const subNode of astNode.params) {
        const subNodeResult = findUndefinedSymbols(subNode, contextStack, builtin)
        subNodeResult.forEach(symbol => undefinedSymbols.add(symbol))
      }
      return undefinedSymbols
    }
    case `SpecialExpression`: {
      const specialExpression = asValue(builtin.specialExpressions[astNode.name], astNode.token?.debugInfo)
      const result = specialExpression.findUndefinedSymbols(astNode, contextStack, {
        findUndefinedSymbols,
        builtin,
      })
      return result
    }
  }
}
