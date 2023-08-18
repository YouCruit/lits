import { Token } from '../tokenizer/interface'
import { Ast, AstNode } from './interface'
import { parseToken } from './parsers'

export function parse(tokens: Token[]): Ast {
  const ast: Ast = {
    b: [],
  }

  let position = 0
  let node: AstNode
  while (position < tokens.length) {
    ;[position, node] = parseToken(tokens, position)
    ast.b.push(node)
  }

  return ast
}
