export enum AstNodeType {
  Number = 0,
  String = 1,
  NormalExpression = 2,
  SpecialExpression = 3,
  Name = 4,
  Modifier = 5,
  ReservedName = 6,
  Binding = 7,
  Argument = 8,
  Partial = 9,
}

export function isAstNodeType(type: unknown): type is AstNodeType {
  return typeof type === `number` && Number.isInteger(type) && type >= 0 && type <= 9
}
