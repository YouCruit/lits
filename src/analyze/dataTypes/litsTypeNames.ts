const typeNames = [
  `never`,
  `nil`,
  `empty-string`,
  `non-empty-string`,
  `string`,
  `zero`,
  `non-zero-number`,
  `positive-number`,
  `negative-number`,
  `non-positive-number`,
  `non-negative-number`,
  `integer`,
  `non-integer`,
  `non-zero-integer`,
  `non-zero-non-integer`,
  `positive-integer`,
  `negative-integer`,
  `positive-non-integer`,
  `negative-non-integer`,
  `non-positive-integer`,
  `non-negative-integer`,
  `number`,
  `true`,
  `false`,
  `boolean`,
  `empty-array`,
  `non-empty-array`,
  `array`,
  `empty-object`,
  `non-empty-object`,
  `object`,
  `regexp`,
  `function`,
  `unknown`,
  `truthy`,
  `falsy`,
  `empty-collection`,
  `non-empty-collection`,
  `collection`,
  `empty-sequence`,
  `non-empty-sequence`,
  `sequence`,
] as const

export type TypeName = typeof typeNames[number]

export function isTypeName(typeName: string): typeName is TypeName {
  return typeNames.includes(typeName as TypeName)
}
