import { builtin } from '../builtin'
import { lookUp } from '../evaluator'
import { ContextStack } from '../evaluator/interface'
import { AstNode } from '../parser/interface'
import { asValue } from '../utils/assertion'

export type AnalyzeResult = {
  undefinedSymbols: Set<string>
}
export type AnalyzeAst = (astNode: AstNode | AstNode[], contextStack: ContextStack) => AnalyzeResult
export const analyzeAst: AnalyzeAst = (astNode, contextStack) => {
  const astNodes = Array.isArray(astNode) ? astNode : [astNode]

  const analyzeResult: AnalyzeResult = {
    undefinedSymbols: new Set<string>(),
  }

  for (const subNode of astNodes) {
    const result = analyzeAstNode(subNode, contextStack)
    result.undefinedSymbols.forEach(symbol => analyzeResult.undefinedSymbols.add(symbol))
  }

  return analyzeResult
}

function analyzeAstNode(astNode: AstNode, contextStack: ContextStack): AnalyzeResult {
  const emptySet = new Set<string>()
  switch (astNode.type) {
    case `Name`: {
      const lookUpResult = lookUp(astNode, contextStack)
      if (!lookUpResult.builtinFunction && !lookUpResult.contextEntry && !lookUpResult.specialExpression) {
        return { undefinedSymbols: new Set([astNode.value]) }
      }
      return { undefinedSymbols: emptySet }
    }
    case `String`:
    case `Number`:
    case `Modifier`:
    case `ReservedName`:
      return { undefinedSymbols: emptySet }
    case `NormalExpression`: {
      const undefinedSymbols = new Set<string>()
      const { expression, name, token } = astNode
      if (typeof name === `string`) {
        const lookUpResult = lookUp({ type: `Name`, value: name, token }, contextStack)
        if (
          lookUpResult.builtinFunction === null &&
          lookUpResult.contextEntry === null &&
          lookUpResult.specialExpression === null
        ) {
          undefinedSymbols.add(name)
        }
      }
      if (expression) {
        switch (expression.type) {
          case `String`:
          case `Number`:
            break
          case `NormalExpression`:
          case `SpecialExpression`: {
            const subResult = analyzeAstNode(expression, contextStack)
            subResult.undefinedSymbols.forEach(symbol => undefinedSymbols.add(symbol))
            break
          }
        }
      }

      for (const subNode of astNode.params) {
        const subNodeResult = analyzeAst(subNode, contextStack)
        subNodeResult.undefinedSymbols.forEach(symbol => undefinedSymbols.add(symbol))
      }
      return { undefinedSymbols }
    }
    case `SpecialExpression`: {
      const specialExpression = asValue(builtin.specialExpressions[astNode.name], astNode.token.debugInfo)
      const result = specialExpression.analyze(astNode, contextStack, {
        analyzeAst,
        builtin,
      })
      return result
    }
  }
}

export function joinAnalyzeResults(...results: AnalyzeResult[]): AnalyzeResult {
  const result: AnalyzeResult = {
    undefinedSymbols: new Set(),
  }
  for (const input of results) {
    input.undefinedSymbols.forEach(symbol => result.undefinedSymbols.add(symbol))
  }
  return result
}

export function addAnalyzeResults(target: AnalyzeResult, source: AnalyzeResult): void {
  source.undefinedSymbols.forEach(symbol => target.undefinedSymbols.add(symbol))
}
