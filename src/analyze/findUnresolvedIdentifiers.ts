import type { Builtin } from '../builtin/interface'
import { AstNodeType } from '../constants/constants'
import type { ContextStack } from '../evaluator/ContextStack'
import type { AstNode } from '../parser/interface'
import { asNonUndefined } from '../typeGuards'
import { evaluateAstNode } from '../evaluator'
import type { FindUnresolvedIdentifiers, UnresolvedIdentifier, UnresolvedIdentifiers } from '.'

export const findUnresolvedIdentifiers: FindUnresolvedIdentifiers = (ast, contextStack, builtin: Builtin) => {
  const astNodes = Array.isArray(ast) ? ast : ast.b

  const unresolvedIdentifiers = new Set<UnresolvedIdentifier>()

  for (const subNode of astNodes) {
    const result = findUnresolvedIdentifiersInAstNode(subNode, contextStack, builtin)
    result.forEach(symbol => unresolvedIdentifiers.add(symbol))
  }

  return unresolvedIdentifiers
}

function findUnresolvedIdentifiersInAstNode(astNode: AstNode, contextStack: ContextStack, builtin: Builtin): UnresolvedIdentifiers {
  const emptySet = new Set<UnresolvedIdentifier>()
  switch (astNode.t) {
    case AstNodeType.Name: {
      const lookUpResult = contextStack.lookUp(astNode)
      if (lookUpResult === null)
        return new Set([{ symbol: astNode.v, token: astNode.tkn }])

      return emptySet
    }
    case AstNodeType.String:
    case AstNodeType.Number:
    case AstNodeType.Modifier:
    case AstNodeType.ReservedName:
      return emptySet
    case AstNodeType.NormalExpression: {
      const unresolvedIdentifiers = new Set<UnresolvedIdentifier>()
      const { e: expression, n: name, tkn: token } = astNode
      if (typeof name === 'string') {
        const lookUpResult = contextStack.lookUp({ t: AstNodeType.Name, v: name, tkn: token })
        if (lookUpResult === null)
          unresolvedIdentifiers.add({ symbol: name, token: astNode.tkn })
      }
      if (expression) {
        switch (expression.t) {
          case AstNodeType.String:
          case AstNodeType.Number:
            break
          case AstNodeType.NormalExpression:
          case AstNodeType.SpecialExpression: {
            const subResult = findUnresolvedIdentifiersInAstNode(expression, contextStack, builtin)
            subResult.forEach(symbol => unresolvedIdentifiers.add(symbol))
            break
          }
        }
      }

      for (const subNode of astNode.p) {
        const innerUnresolvedIdentifiers = findUnresolvedIdentifiersInAstNode(subNode, contextStack, builtin)
        innerUnresolvedIdentifiers.forEach(symbol => unresolvedIdentifiers.add(symbol))
      }
      return unresolvedIdentifiers
    }
    case AstNodeType.SpecialExpression: {
      const specialExpression = asNonUndefined(builtin.specialExpressions[astNode.n], astNode.tkn?.sourceCodeInfo)
      // eslint-disable-next-line ts/no-unsafe-argument
      const unresolvedIdentifiers = specialExpression.findUnresolvedIdentifiers(astNode as any, contextStack, {
        findUnresolvedIdentifiers,
        builtin,
        evaluateAstNode,
      })
      return unresolvedIdentifiers
    }
  }
}
